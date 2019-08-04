---
layout: post
title: Android的MVP模式开发
tags: [Android, MVP]
categories: Android
---


# 简介MVP模式

MVP模式就是就是**Model View Presenter**的简称。它们各自的功能也就是，**Model**：处理应用程序的数据部分和逻辑部分，也就是业务逻辑部分；**View**：它负责在屏幕上显示具有特定数据的视图和响应用户的操作；**Presenter**：它是连接Model和View的桥梁，通过Presenter来进行解耦。利用MVP模式来开发应用好处多多，什么可以单独测试呀、Activity代码不会臃肿和乱七八糟了，因为都通过Presnter来将代码进行剥离了。

所以面对越来越复杂的应用程序，学习MVP模式也是势在必行的一种技能了。

下面来看一下这三者的关系图。

![MVP](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/MVP.jpg?raw=true)

![MVP2](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/MVP2.JPG?raw=true)

初步了解了之后，不管理解了多少，反正知道Presenter是View和Model的桥梁，View和Model之间不能直接通信，必须通过Presenter来交互，这样也就说明了Preseter持有View和Model对象。现在有这些大致印象就差不多了，后面通过例子，来加深一下。

下面来看一下登录的例子，来说明一下MVP模式的使用。

# MVP模式的一个例子：登录

首先我们从界面出发，把界面编写完了，然后一步一步的把思路理清楚，看如何利用MVP模式来实现这个登录的操作。

## 登录界面

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

# 建立View的接口

可以看到这个界面有两个EditText和两个按钮。