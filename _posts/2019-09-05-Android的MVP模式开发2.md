---
layout: post
title: Android的MVP模式开发2
subtitle: MVP模式的的优化
categories: [Android]
tags: [Android]
---

在[Android的MVP模式开发](https://zoharandroid.github.io/2019-08-05-Android%E7%9A%84MVP%E6%A8%A1%E5%BC%8F%E5%BC%80%E5%8F%91/)这篇博客中，已经初步讲解了如何使用和设计MVP模式，但是这个博客最后末尾还留下了个一个问题就是：虽然对各个模块进行解耦了，能够对View中的代码进行减负，但是也正是如此，才会对对没用的View进行引用，虚拟机根本无法回收，最后导致内存泄露。

下面来讲下如何去创建基类，来优化一下MVP模式。

<!-- TOC -->

- [1. 创建M/V/P的基类接口](#1-%e5%88%9b%e5%bb%bamvp%e7%9a%84%e5%9f%ba%e7%b1%bb%e6%8e%a5%e5%8f%a3)
  - [1.1. 创建View的基类接口](#11-%e5%88%9b%e5%bb%baview%e7%9a%84%e5%9f%ba%e7%b1%bb%e6%8e%a5%e5%8f%a3)
  - [1.2. 创建Model的基类接口](#12-%e5%88%9b%e5%bb%bamodel%e7%9a%84%e5%9f%ba%e7%b1%bb%e6%8e%a5%e5%8f%a3)
  - [1.3. 创建Presenter的基类接口](#13-%e5%88%9b%e5%bb%bapresenter%e7%9a%84%e5%9f%ba%e7%b1%bb%e6%8e%a5%e5%8f%a3)
- [2. 实现Presenter基类](#2-%e5%ae%9e%e7%8e%b0presenter%e5%9f%ba%e7%b1%bb)
- [3. 创建Activity的基类](#3-%e5%88%9b%e5%bb%baactivity%e7%9a%84%e5%9f%ba%e7%b1%bb)
- [4. 在Activity中的使用](#4-%e5%9c%a8activity%e4%b8%ad%e7%9a%84%e4%bd%bf%e7%94%a8)

<!-- /TOC -->

# 1. 创建M/V/P的基类接口

## 1.1. 创建View的基类接口

```java
public interface IBaseView {

    /**
     * 显示加载
     */
    void showLoadingView();

    /**
     * 隐藏加载框
     */
    void hideLoadingView();


    /**
     * 获取上下文
     *
     * @return Context
     */
    Context getContext();
}

```

## 1.2. 创建Model的基类接口

```java
public interface IBaseModel {
}
```

## 1.3. 创建Presenter的基类接口

```java
public interface IBasePresenter<V extends IBaseView> {

    /**
     * 依附生命view
     *
     * @param view
     */
    void attachView(V view);

    /**
     * 分离View
     */
    void detachView();

    /**
     * 判断View是否已经销毁
     *
     * @return
     */
    boolean isViewAttached();
}
```

# 2. 实现Presenter基类

```java
public abstract class BasePresenter<M extends IBaseModel, V extends IBaseView> implements IBasePresenter<V> {

    private V mView;
    private M module;
    private WeakReference<V> mWeakReference;

    /**
     * 绑定view
     *
     * @param view
     */
    @SuppressWarnings("unchecked")
    @Override
    public void attachView(V view){
        mWeakReference = new WeakReference<>(view);
        mView = (V)Proxy.newProxyInstance(view.getClass().getClassLoader(), view.getClass().getInterfaces(), new MvpViewHandler(mWeakReference.get()));
        if (this.module == null){
            this.module = createModule();
        }
    }

    /**
     * 分离View
     */
    @Override
    public void detachView(){
        this.module = null;
        if (isViewAttached()){
            mWeakReference.clear();
            mWeakReference = null;
        }
    }

    /**
     * 判断view是否销毁
     *
     * @return
     */
    @Override
    public boolean isViewAttached(){
        return mWeakReference != null && mWeakReference.get() != null;
    }


    /**
     * 获取view
     *
     * @return view
     */
    protected V getView(){
        return mView;
    }

    /**
     * 获取module
     *
     * @return model
     */
    protected M getModule(){
        return module;
    }

    protected abstract M createModule();

    /**
     * View代理类：防止页面关闭了P层异步调用V方法，造成空指针异常
     */
    private class MvpViewHandler implements InvocationHandler {

        private IBaseView mvpView;

        public MvpViewHandler(IBaseView mvpView) {
            this.mvpView = mvpView;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            // 如果view层没有被销毁，那么就调用view层的方法
            if (isViewAttached()){
                return method.invoke(mvpView, args);
            }
            // P层不关心view层的返回值
            return null;
        }
    }
}
```

# 3. 创建Activity的基类

```java
public abstract class BaseActivity<P extends BasePresenter> extends AppCompatActivity implements IBaseView{


    protected P presenter;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(setLayoutResId());
        initView();
        // 创建Presenter
        presenter = createPresenter();
        if (presenter != null){
            presenter.attachView(this);
        }
        initEventAndData();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (presenter != null){
            presenter.detachView();
            presenter = null;
        }
    }

    /**
     * 创建Presenter
     *
     * @return P Presenter对象
     */
    protected abstract P createPresenter();

    /**
     * 插入布局文件
     *
     * @return
     */
    protected abstract int setLayoutResId();

    /**
     * 初始化布局View
     */
    protected abstract void initView();

    /**
     * 初始哈化事件和数据
     */
    protected abstract void initEventAndData();
}
```

# 4. 在Activity中的使用

```java
public class MainActivity extends BaseActivity<LogoutPresenter> implements ILoginOutView {
      @Override
    protected LogoutPresenter createPresenter() {
        mPresenter = new LogoutPresenter();
        return mPresenter;
    }

        @Override
    protected int setLayoutResId() {
        return R.layout.activity_main;
    }

    @Override
    protected void initView() {
    }

     @Override
    protected void initEventAndData() {
    }

    @Override
    public Context getContext() {
        return this;
    }
    
   // ...等等View中的一些接口方法
}
```

让Activity去继承BaseActivity并实现View中的一些接口方法。



