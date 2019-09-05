---
layout: post
title: Android打开某个Activity时自动弹出软键盘
subtitle: 解决不自动弹出软键盘的方法
targs: [Android]
categories: Android
---


当前需求是：进入搜索界面，EditText能够直接获取焦点，然后打开软键盘，提升用户体验。但是，尝试过多种方法方法去打开软键盘，比如说：修改Menifest中的属性、通过InputMethodManager去直接打开软键盘等方法，发现都无法打开软键盘。下面我通过如下方法来打开软键盘。

## Keyborad工具类

通过这个工具类，一般情况下是可以调用这个工具类的方法来直接打开或者关闭软键盘。

```java
/**
 * Created by zohar on 2019/7/29 22:00
 * Describe: 键盘的工具类
 */
public class KeyboardUtils {

    private KeyboardUtils(){}

    /**
     * 打开软键盘
     *
     * @param context context
     * @param editText EditText View
     */
    public static void openKeyboard(EditText editText){
        InputMethodManager imm = (InputMethodManager) editText.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null) {
            // 显示软件盘
            imm.showSoftInput(editText, 0);
        }
    }

    /**
     * 隐藏软键盘
     *
     * @param context context
     * @param editText EditText View
     */
    public static void closeKeyboard(Context context, EditText editText){
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        if ( imm != null){
            // 隐藏
            imm.hideSoftInputFromWindow(editText.getWindowToken(), 0);
        }
    }

    /**
     *
     * @param context
     */
    public static void toggleKeyboard(Context context){
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        if ( imm != null){
            // 隐藏
            imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, 0);
        }
    }
}

```

## EditText的处理

对EditText进行焦点获取，然后通过计数器的schedule方法来触发调用键盘工具类，来打开软键盘。

```java
 // 打开软键盘
        mSearchEditText.requestFocus();

        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                KeyboardUtils.openKeyboard(mSearchEditText);
            }
        }, 600);  //在0.6秒后打开
```

通过上面的方法，我都能够解决直接调用键盘工具类无法打开软键盘的这种情况。

## 效果图

<img src = "https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-09/search.gif?raw=true" width = 300px height = 500px>

