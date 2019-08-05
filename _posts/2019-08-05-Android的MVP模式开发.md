---
layout: post
title: Android的MVP模式开发
tags: [Android, MVP]
categories: Android
---

<!-- TOC -->

- [1. 简介MVP模式](#1-%e7%ae%80%e4%bb%8bmvp%e6%a8%a1%e5%bc%8f)
- [2. MVP模式的一个例子：登录](#2-mvp%e6%a8%a1%e5%bc%8f%e7%9a%84%e4%b8%80%e4%b8%aa%e4%be%8b%e5%ad%90%e7%99%bb%e5%bd%95)
  - [2.1. 登录界面](#21-%e7%99%bb%e5%bd%95%e7%95%8c%e9%9d%a2)
  - [2.2. Bean部分](#22-bean%e9%83%a8%e5%88%86)
  - [2.3. View部分](#23-view%e9%83%a8%e5%88%86)
    - [2.3.1. 建立View的接口](#231-%e5%bb%ba%e7%ab%8bview%e7%9a%84%e6%8e%a5%e5%8f%a3)
    - [2.3.2. 实现ILoginView](#232-%e5%ae%9e%e7%8e%b0iloginview)
  - [2.4. Model部分](#24-model%e9%83%a8%e5%88%86)
    - [2.4.1. 定义OnLoginListener接口](#241-%e5%ae%9a%e4%b9%89onloginlistener%e6%8e%a5%e5%8f%a3)
    - [2.4.2. 提供登录接口](#242-%e6%8f%90%e4%be%9b%e7%99%bb%e5%bd%95%e6%8e%a5%e5%8f%a3)
    - [2.4.3. 实现LoginMode](#243-%e5%ae%9e%e7%8e%b0loginmode)
  - [2.5. Presenter部分](#25-presenter%e9%83%a8%e5%88%86)
  - [2.6. 完善View的代码](#26-%e5%ae%8c%e5%96%84view%e7%9a%84%e4%bb%a3%e7%a0%81)
  - [2.7. 效果](#27-%e6%95%88%e6%9e%9c)
- [3. 后续](#3-%e5%90%8e%e7%bb%ad)

<!-- /TOC -->

# 1. 简介MVP模式

MVP模式就是就是**Model View Presenter**的简称。它们各自的功能也就是，
* **Model**：处理应用程序的数据部分和逻辑部分，也就是业务逻辑部分；
* **View**：它负责在屏幕上显示具有特定数据的视图和响应用户的操作；
* **Presenter**：它是连接Model和View的桥梁，通过Presenter来进行解耦。利用MVP模式来开发应用好处多多，什么可以单独测试呀、Activity代码不会臃肿和乱七八糟了，因为都通过Presnter来将代码进行剥离了。

所以面对越来越复杂的应用程序，学习MVP模式也是势在必行的一种技能了。

下面来看一下这三者的关系图。

![MVP](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/MVP.jpg?raw=true)

![MVP2](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/MVP2.JPG?raw=true)

初步了解了之后，不管理解了多少，反正知道Presenter是View和Model的桥梁，View和Model之间不能直接通信，必须通过Presenter来交互，这样也就说明了Preseter必须持有View和Model对象，这样才能用对View和Model进行交互。好了，现在有这些大致印象就差不多了，后面通过例子，来加深一下。

下面来看一下登录的例子，来说明一下MVP模式的使用。

# 2. MVP模式的一个例子：登录

首先我们从界面出发，把界面编写完了，然后一步一步的把思路理清楚，看如何利用MVP模式来实现这个登录的操作。

## 2.1. 登录界面

先来看看登录界面的效果.如果想自己写界面，那么就不用看我写的登录界面的代码了。

![login](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/login.png?raw=true)

下面是登录的布局文件:

activity_login.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".view.LoginActivity">

    <EditText
        android:id="@+id/user_name_edit_text"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_margin="10dip"
        android:hint="请输入用户名"
        android:padding="10dip"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <EditText
        android:id="@+id/password_edit_text"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_margin="10dip"
        android:hint="请输入密码"
        android:padding="10dip"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toBottomOf="@id/user_name_edit_text" />

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@id/password_edit_text">

        <Button
            android:id="@+id/login"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="LOGIN" />

        <Button
            android:id="@+id/clear"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="CLEAR" />
    </LinearLayout>

    <ProgressBar
        android:visibility="gone"
        android:id="@+id/loading_progress_bar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</android.support.constraint.ConstraintLayout>
```

## 2.2. Bean部分

创建User类，定义了用户名和密码。

User.java：
```java
package com.zohar.blogmvp.bean;

/**
 * Created by zohar on 2019/8/4 21:28
 * Describe:
 */
public class User {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

## 2.3. View部分

### 2.3.1. 建立View的接口

创建`ILoginView.java`接口类，那么如何写这个接口呢？

可以看到这个界面有两个EditText输入框和两个按钮，一个是Login登录按钮，一个是Clear清除输入框按钮。

既然有两个输入框，那么必然会有获取用户名和用户密码的操作，那么就会有如下定义:

```
String getUsername();
String getPassword();
```

既然有Clear清除按钮，那么就会有清除输入框的操作，就会有如下定义：

```
void clearUsername();
void clearPassword();
```

既然有Login登录按钮，那么就会有登录成功该显示什么，登录失败该显示什么吧，就会有如下定义：

```
void showLoginSuccess();
void shoeLoginFailed();
```

登录操作在实际中是需要访问远程服务端去验证的，所以是耗时的操作，那么就需要用个Progressbar来提高用户体验，那么就需要一个显示加载和隐藏加载的定义吧，如下:

```
void showLoading();
void hideLoading();
```

好了，综上分析，那么整个`ILoginView.java`接口文件就如下代码一样：

```java
package com.zohar.blogmvp.view;

/**
 * Created by zohar on 2019/8/4 21:16
 * Describe:
 *
 * 登录的View接口
 */
public interface ILoginView {

    void showLoading();
    void hideLoading();

    String getUsername();
    String getPassword();

    void clearUsername();
    void clearPassword();

    // 登录成功该显示什么？
    void showLoginSuccess();
    // 登录失败该显示什么？
    void showLoginFailed();
}
```

接下来就需要去实现这个接口了。 

### 2.3.2. 实现ILoginView

要实现`ILoginView.java`，起始就是用一个`Activity`去实现这个接口。这部分比较简单没有什么好讲解的，就是将布局组件全部进行初始化，然后实现`ILoginView`的接口。下面直接贴代码，比较好理解。至于两个按钮的点击事件，现在先不做处理，因为用户点击了按钮之后，是需要交给Presenter去处理的，Presenter然后去访问Model的登录去验证用户输入的密码是否正确的，所以，我们等Presenter完成之后再来完成这部分的代码。

```java
package com.zohar.blogmvp.view;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.zohar.blogmvp.R;
import com.zohar.blogmvp.presenter.LoginPresenter;

public class LoginActivity extends AppCompatActivity implements ILoginView {

    private EditText mUsernameEdit, mPasswordEdit;
    private Button mLoginButton, mClearButton;
    private ProgressBar mLoadingProgress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        initView();
    }

    private void initView() {
        mUsernameEdit = findViewById(R.id.user_name_edit_text);
        mPasswordEdit = findViewById(R.id.password_edit_text);
        mLoginButton = findViewById(R.id.login);
        mClearButton = findViewById(R.id.clear);
        mLoadingProgress = findViewById(R.id.loading_progress_bar);

        // 接下来就是将数据提交给presenter来处理了，这里将数据提交给presenter
        mLoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 调动preseter来处理登录
        
            }
        });

        mClearButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });

    }

    @Override
    public void showLoading() {
        mLoadingProgress.setVisibility(View.VISIBLE);
    }

    @Override
    public void hideLoading() {
        mLoadingProgress.setVisibility(View.GONE);
    }

    @Override
    public String getUsername() {
        return mUsernameEdit.getText().toString();
    }

    @Override
    public String getPassword() {
        return mPasswordEdit.getText().toString();
    }

    @Override
    public void clearUsername() {
        mUsernameEdit.setText("");
    }

    @Override
    public void clearPassword() {
        mPasswordEdit.setText("");
    }

    @Override
    public void showLoginSuccess() {
        Toast.makeText(this, "登录成功！", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void showLoginFailed() {
        Toast.makeText(this, "登录失败！", Toast.LENGTH_SHORT).show();
    }
}
```

## 2.4. Model部分

因为Presenter部分需要持有View和Model两个部分，所以这里先把Model部分完成了，然后才好去完成Presenter部分。

定义`LoginMode.java`文件，其实这个类就是完成一个操作就是登录验证功能，这里就需要用户名和用户密码，而且登录完成之后，需要给调用者提供回调接口，让调用者知道，我是登录失败还是登录成功了，所以这里需要一个接口，也就是`OnLoginListener`接口。

### 2.4.1. 定义OnLoginListener接口

这里先定义`OnLoginListener`接口，也就包含了登录成功和登录失败的回调接口。代码如下：

OnLoginListener.java：

```java
package com.zohar.blogmvp.model;

import com.zohar.blogmvp.bean.User;

/**
 * Created by zohar on 2019/8/4 21:32
 * Describe:
 *
 * 向外提供登录是否成功的接口
 */
public interface OnLoginListener {

    void loginSuccess(User user);
    void loginFailde();
}
```

### 2.4.2. 提供登录接口

创建`ILoginModel.java`接口，提供登录接口。

```java
package com.zohar.blogmvp.model;

/**
 * Created by zohar on 2019/8/4 21:30
 * Describe:
 */
public interface ILoginModel {

    void login(String username, String password, OnLoginListener loginListener);
}

```

### 2.4.3. 实现LoginMode

下面就是完成`LoginModel`部分的代码，实现Model的登录接口。这里开一个线程开进行验证，并且使用`sleep`来模拟登录验证。


LoginModel.java：
```java
package com.zohar.blogmvp.model;

import com.zohar.blogmvp.bean.User;

/**
 * Created by zohar on 2019/8/4 21:33
 * Describe:
 */
public class LoginModel implements ILoginModel {

    @Override
    public void login(final String username, final String password, final OnLoginListener loginListener) {
        // 判断用户传递过来的数据是否正确
        // 开启线程判断
        new Thread(new Runnable() {
            @Override
            public void run() {
                // 先让线程停止2秒钟来模拟登录状态
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                if ("zzh".equals(username) && "123".equals(password)){
                    User user = new User();
                    user.setPassword(password);
                    user.setUsername(username);
                    loginListener.loginSuccess(user);
                }else{
                    loginListener.loginFailde();
                }
            }
        }).start();

    }
}

```

## 2.5. Presenter部分

创建`LoginPresenter.java`类，让这个构造函数传递View过来。

然后在`login`方法去调用View中的界面操作和Model的登录验证操作，然后通过Model提供的回调方法`OnLoginListener`，告诉调用者是登录成功了，还是登录失败了。之后再通过View告诉用户登录的结果是怎么样的。

`clear`方法就是用户点击View中的clear按钮之后，传递给Presenter进行处理。所以从这里也可以看出，不管怎么样View的所有操作都是传递给Presenter进行处理，大大减轻了Activity的代码。

```java
package com.zohar.blogmvp.presenter;

import android.os.Handler;

import com.zohar.blogmvp.bean.User;
import com.zohar.blogmvp.model.ILoginModel;
import com.zohar.blogmvp.model.LoginModel;
import com.zohar.blogmvp.model.OnLoginListener;
import com.zohar.blogmvp.view.ILoginView;


/**
 * Created by zohar on 2019/8/4 21:25
 * Describe:
 */
public class LoginPresenter {

    private ILoginView mLoginView;
    private ILoginModel mLoginModel;


    private Handler mHandler = new Handler();

    public LoginPresenter(ILoginView loginView) {
        // 将View传递过来
        mLoginView = loginView;
        mLoginModel = new LoginModel();
    }

    public void login(){
        mLoginView.showLoading();
        // 然后调用model的登录接口来判断用户输入的数据是否证券
        mLoginModel.login(mLoginView.getUsername(), mLoginView.getPassword(), new OnLoginListener() {
            @Override
            public void loginSuccess(User user) {
                // 如果presenter返回过来的信息，登录成功，那么我的界面应该怎么操作呢？
                // 也就是调用view的接口，让view进行响应
                mHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        mLoginView.showLoginSuccess();
                        mLoginView.hideLoading();
                    }
                });
            }

            @Override
            public void loginFailde() {
                mHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        mLoginView.showLoginFailed();
                        mLoginView.hideLoading();
                    }
                });
            }
        });
    }

    public void clear(){
        mLoginView.clearUsername();
        mLoginView.clearPassword();
    }
}

```

## 2.6. 完善View的代码

上面在说到View部分，其实还有部分代码是没有完成的，因为View还没有将用户的一些事件传递给Presenter进行处理，所以，下面把完整的`LoginActivity`代码贴上来。

其实也就是，创建Presenter对象，然后在Login登录和Clear清除两个按钮，调用Presenter定义的`login`和`clear`方法去处理即可。

LoginActivity.java：
```java
package com.zohar.blogmvp.view;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.zohar.blogmvp.R;
import com.zohar.blogmvp.presenter.LoginPresenter;

public class LoginActivity extends AppCompatActivity implements ILoginView {

    private EditText mUsernameEdit, mPasswordEdit;
    private Button mLoginButton, mClearButton;
    private ProgressBar mLoadingProgress;

    private LoginPresenter mLoginPresenter = new LoginPresenter(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        initView();
    }

    private void initView() {
        mUsernameEdit = findViewById(R.id.user_name_edit_text);
        mPasswordEdit = findViewById(R.id.password_edit_text);
        mLoginButton = findViewById(R.id.login);
        mClearButton = findViewById(R.id.clear);
        mLoadingProgress = findViewById(R.id.loading_progress_bar);

        // 接下来就是将数据提交给presenter来处理了，这里将数据提交给presenter
        mLoginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 调动preseter来处理登录
                mLoginPresenter.login();
            }
        });

        mClearButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mLoginPresenter.clear();
            }
        });

    }

    @Override
    public void showLoading() {
        mLoadingProgress.setVisibility(View.VISIBLE);
    }

    @Override
    public void hideLoading() {
        mLoadingProgress.setVisibility(View.GONE);
    }

    @Override
    public String getUsername() {
        return mUsernameEdit.getText().toString();
    }

    @Override
    public String getPassword() {
        return mPasswordEdit.getText().toString();
    }

    @Override
    public void clearUsername() {
        mUsernameEdit.setText("");
    }

    @Override
    public void clearPassword() {
        mPasswordEdit.setText("");
    }

    @Override
    public void showLoginSuccess() {
        Toast.makeText(this, "登录成功！", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void showLoginFailed() {
        Toast.makeText(this, "登录失败！", Toast.LENGTH_SHORT).show();
    }
}

```

## 2.7. 效果

到此，代码也就完成了，逻辑还是很清楚的。下面来看下效果。

![loginmvp](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/loginmvp.gif?raw=true)

# 3. 后续

其实，整个代码还没有完，还是有问题存在的。比如，用户点击退出应用，本应该Activity都应该被回收的，但是由于都解耦了，可能Presenter还存在View的引用，那么虚拟机对Activity回收不了，随着操作这次的增多，对来越多的Activity被创建，然后又不能被虚拟机回收，所以也就容易造成内存泄露的问题，那么该如何处理呢，下面等后续分解吧！(*^__^*) 嘻嘻

