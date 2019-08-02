---
layout: post
title: Jekyll个人博客添利用gitalk加评论功能
tags: [Jekyll, gitalk]
categories: Jekyll
---

博客评论功能也是必不可少的一部分。评论不仅能够让阅读者进行评价和提问，作者也可以通过评论功能来进行回复。加入评论功能，对博客的用户体验的整体水平都有很大的提升。作为博客的拥有者，喜欢捣鼓，喜欢折腾，所以不能让自己的博客缺胳膊少腿的，立刻来实现评论功能吧。

上网查询了一下，自己总结就是，去使用**[gitalk](https://github.com/gitalk/gitalk)** 或者 **[gitmen](https://github.com/imsun/gitment)**这两个开源库吧。 这里我推荐选择**gitalk**，这个博客也是使用的gitalk来实现评论功能的。下面来看看如何利用gitalk来实现评论功能吧。


# 在github中创建授权

打开自己的github主页，点击右上角的图片，然后点击Settings，然后选择Developer Settings，然后选择OAuth Apps，来创建一个New OAuth App。按照自己的情况，对着如下图所示的例子来进行对应的修改。这主要的是**Callback回调**要填对自己的地址。

![](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/comments1.png?raw=true){: .center-block :}

创建之后就会生成一个**clientID**和**clientSecret**，下面会用到，然后直接复制进行填写。

# 修改post.html文件

因为评论都是放在文章的末尾，所以我也就在末尾添加评论功能了。

打开`_layout/post.html`文件，在该文件的`page.comments`字符字样部分的后面添加如下代码到该文件下。

```html
<!--使用gitalk来当做文章的评论部分-->
	  <div id="gitalk-container"></div>
	   <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
	   <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
	   <script src="{{ site.baseurl }}/js/md5.min.js"></script>
	  <script>
		   var gitalk = new Gitalk({
			  clientID: 'xx',
			  clientSecret: 'xx',
			  repo: 'zoharandroid.github.io',
			  owner: 'ZoharAndroid',
			  admin: ['ZoharAndroid'],
			  id:  md5(location.href),      // Ensure uniqueness and length less than 50
			  distractionFreeMode: true  // Facebook-like distraction free mode
			})

			gitalk.render('gitalk-container')
		</script>
```

为了防止自己表达不清楚，所以回帖上`post.html`文件的整个代码，这样，就可以看到要增加的代码在什么位置了。

下面是`post.html`整个文件的代码。

```html
---
layout: base
---
{% raw %}
{% include header.html type="post" %}

<div class="container">
  <div class="row">
    <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">

      {% if page.gh-repo %}
        {% assign gh_split =  page.gh-repo | split:'/'  %}
        {% assign gh_user =  gh_split[0]  %}
        {% assign gh_repo =  gh_split[1]  %}

        <div id="header-gh-btns">
          {% if page.gh-badge.size > 0 %}
            {% for badge in page.gh-badge %}
              {% case badge %}
                {% when 'star'%}
                  <iframe src="https://ghbtns.com/github-btn.html?user={{ gh_user }}&repo={{ gh_repo }}&type=star&count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe>
                {% when 'watch'%}
                  <iframe src="https://ghbtns.com/github-btn.html?user={{ gh_user }}&repo={{ gh_repo }}&type=watch&v=2&count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe>
                {% when 'fork'%}
                  <iframe src="https://ghbtns.com/github-btn.html?user={{ gh_user }}&repo={{ gh_repo }}&type=fork&count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe>
                {% when 'follow'%}
                  <iframe src="https://ghbtns.com/github-btn.html?user={{ gh_user }}&type=follow&count=true" frameborder="0" scrolling="0" width="220px" height="20px"></iframe>
              {% endcase %}
            {% endfor %}
          {% endif %}
        </div>
      {% endif %}

      <article role="main" class="blog-post">
        {{ content }}
      </article>

	  <!--文章尾部添加tags-->
      {% if page.tags.size > 0 %}
        <div class="blog-tags">
          Tags:
          {% if site.link-tags %}
          {% for tag in page.tags %}
            <a href="{{ '/tags' | relative_url }}#{{- tag -}}">{{- tag -}}</a>
          {% endfor %}
          {% else %}
            {{ page.tags | join: ", " }}
          {% endif %}
        </div>
      {% endif %}

	<!--添加分类-->
	 {% if page.categories.size > 0 %}
		  <div class="blog-tags">
		  Category：
		{% if post %}
			{% assign categories = post.categories %}
		{% else %}
			{% assign categories = page.categories %}
		{% endif %}
		{% for category in categories %}
			<a href="{{site.baseurl}}/categories/#{{category|slugize}}">{{category}}</a>
			{% unless forloop.last %}&nbsp;{% endunless %}
			{% endfor %}
		</div>
	{% endif %}

	  <!--文章尾部的社交平台分享-->
      {% if page.social-share %}
        {% include social-share.html %}
      {% endif %}

	<!--下一页和上一页-->
      <ul class="pager blog-pager">
        {% if page.previous.url %}
        <li class="previous">
          <a href="{{ page.previous.url | relative_url }}" data-toggle="tooltip" data-placement="top" title="{{page.previous.title}}">&larr; Previous Post</a>
        </li>
        {% endif %}
        {% if page.next.url %}
        <li class="next">
          <a href="{{ page.next.url | relative_url }}" data-toggle="tooltip" data-placement="top" title="{{page.next.title}}">Next Post &rarr;</a>
        </li>
        {% endif %}
      </ul>
	  
	  <!--文章尾部的评论部分-->
      {% if page.comments %}
        <div class="disqus-comments">
          {% include disqus.html %}
        </div>
          {% include fb-comment.html %}
        <div class="staticman-comments">
          {% include staticman-comments.html %}
        </div>
        <div class="justcomments-comments">
          {% include just_comments.html %}
        </div>
      {% endif %}
	  
	  <!--使用gitalk来当做文章的评论部分-->
	  <div id="gitalk-container"></div>
	   <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
	   <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
	   <script src="{{ site.baseurl }}/js/md5.min.js"></script>
	  <script>
		   var gitalk = new Gitalk({
			  clientID: 'xx',
			  clientSecret: 'xx',
			  repo: 'zoharandroid.github.io',
			  owner: 'ZoharAndroid',
			  admin: ['ZoharAndroid'],
			  id:  md5(location.href),      // Ensure uniqueness and length less than 50
			  distractionFreeMode: true  // Facebook-like distraction free mode
			})

			gitalk.render('gitalk-container')
		</script>
    </div>
  </div>
</div>
 {% endraw %}
```

# 添加md5的js文件

## 为什么要用到md5？

可以看到在id的部分利用了md5，这里为什么要用到md5呢？

**其实，在本人实践的时候，发现当博客名称稍微长一点的时候，评论就会加载不出来，所以这里就用到md5来重新编码一下**。这样就不会出现评论加载不出来的问题了。

## 添加md5文件

在`/js/`目录下创建一个名称为`md5.min.js`的文件，然后将下面的代码复制到该文件中。

```js
!function(n){"use strict";function d(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function f(n,t,r,e,o,u){return d(function(n,t){return n<<t|n>>>32-t}(d(d(t,n),d(e,u)),o),r)}function l(n,t,r,e,o,u,c){return f(t&r|~t&e,n,t,o,u,c)}function g(n,t,r,e,o,u,c){return f(t&e|r&~e,n,t,o,u,c)}function v(n,t,r,e,o,u,c){return f(t^r^e,n,t,o,u,c)}function m(n,t,r,e,o,u,c){return f(r^(t|~e),n,t,o,u,c)}function i(n,t){var r,e,o,u,c;n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;var f=1732584193,i=-271733879,a=-1732584194,h=271733878;for(r=0;r<n.length;r+=16)i=m(i=m(i=m(i=m(i=v(i=v(i=v(i=v(i=g(i=g(i=g(i=g(i=l(i=l(i=l(i=l(o=i,a=l(u=a,h=l(c=h,f=l(e=f,i,a,h,n[r],7,-680876936),i,a,n[r+1],12,-389564586),f,i,n[r+2],17,606105819),h,f,n[r+3],22,-1044525330),a=l(a,h=l(h,f=l(f,i,a,h,n[r+4],7,-176418897),i,a,n[r+5],12,1200080426),f,i,n[r+6],17,-1473231341),h,f,n[r+7],22,-45705983),a=l(a,h=l(h,f=l(f,i,a,h,n[r+8],7,1770035416),i,a,n[r+9],12,-1958414417),f,i,n[r+10],17,-42063),h,f,n[r+11],22,-1990404162),a=l(a,h=l(h,f=l(f,i,a,h,n[r+12],7,1804603682),i,a,n[r+13],12,-40341101),f,i,n[r+14],17,-1502002290),h,f,n[r+15],22,1236535329),a=g(a,h=g(h,f=g(f,i,a,h,n[r+1],5,-165796510),i,a,n[r+6],9,-1069501632),f,i,n[r+11],14,643717713),h,f,n[r],20,-373897302),a=g(a,h=g(h,f=g(f,i,a,h,n[r+5],5,-701558691),i,a,n[r+10],9,38016083),f,i,n[r+15],14,-660478335),h,f,n[r+4],20,-405537848),a=g(a,h=g(h,f=g(f,i,a,h,n[r+9],5,568446438),i,a,n[r+14],9,-1019803690),f,i,n[r+3],14,-187363961),h,f,n[r+8],20,1163531501),a=g(a,h=g(h,f=g(f,i,a,h,n[r+13],5,-1444681467),i,a,n[r+2],9,-51403784),f,i,n[r+7],14,1735328473),h,f,n[r+12],20,-1926607734),a=v(a,h=v(h,f=v(f,i,a,h,n[r+5],4,-378558),i,a,n[r+8],11,-2022574463),f,i,n[r+11],16,1839030562),h,f,n[r+14],23,-35309556),a=v(a,h=v(h,f=v(f,i,a,h,n[r+1],4,-1530992060),i,a,n[r+4],11,1272893353),f,i,n[r+7],16,-155497632),h,f,n[r+10],23,-1094730640),a=v(a,h=v(h,f=v(f,i,a,h,n[r+13],4,681279174),i,a,n[r],11,-358537222),f,i,n[r+3],16,-722521979),h,f,n[r+6],23,76029189),a=v(a,h=v(h,f=v(f,i,a,h,n[r+9],4,-640364487),i,a,n[r+12],11,-421815835),f,i,n[r+15],16,530742520),h,f,n[r+2],23,-995338651),a=m(a,h=m(h,f=m(f,i,a,h,n[r],6,-198630844),i,a,n[r+7],10,1126891415),f,i,n[r+14],15,-1416354905),h,f,n[r+5],21,-57434055),a=m(a,h=m(h,f=m(f,i,a,h,n[r+12],6,1700485571),i,a,n[r+3],10,-1894986606),f,i,n[r+10],15,-1051523),h,f,n[r+1],21,-2054922799),a=m(a,h=m(h,f=m(f,i,a,h,n[r+8],6,1873313359),i,a,n[r+15],10,-30611744),f,i,n[r+6],15,-1560198380),h,f,n[r+13],21,1309151649),a=m(a,h=m(h,f=m(f,i,a,h,n[r+4],6,-145523070),i,a,n[r+11],10,-1120210379),f,i,n[r+2],15,718787259),h,f,n[r+9],21,-343485551),f=d(f,e),i=d(i,o),a=d(a,u),h=d(h,c);return[f,i,a,h]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function h(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function e(n){var t,r,e="0123456789abcdef",o="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),o+=e.charAt(t>>>4&15)+e.charAt(15&t);return o}function r(n){return unescape(encodeURIComponent(n))}function o(n){return function(n){return a(i(h(n),8*n.length))}(r(n))}function u(n,t){return function(n,t){var r,e,o=h(n),u=[],c=[];for(u[15]=c[15]=void 0,16<o.length&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}(r(n),r(t))}function t(n,t,r){return t?r?u(t,n):function(n,t){return e(u(n,t))}(t,n):r?o(n):function(n){return e(o(n))}(n)}"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:n.md5=t}(this);
//# sourceMappingURL=md5.min.js.map
```

# 效果展示

进过上面的一系类操作之后，评论功能基本上也就可以用起来了。效果如下

![](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/comments1.png?raw=true){: .center-block :}


**如需转载，请附上链接: https://zoharandroid.github.io/ 。**