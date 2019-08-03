---
layout: post
title: Jekyll个人博客添加分类Category功能
tags: [Jekyll]
categories: Jekyll
---

虽然这个博客自带的有标签Tags功能，但是还是感觉Tags和分类Category还是有点差别，一个博客没有分类还是少了点意思，我也是爱折腾，所以也就把这个分类功能来在自己的博客上实现一下。

下面来看下我是如何去实现分类这个功能的。
<!-- TOC -->

- [修改_config.yml文件](#修改_configyml文件)
- [创建categories.html文件](#创建categorieshtml文件)
- [对每个文章进行分类的添加](#对每个文章进行分类的添加)
- [结果展示](#结果展示)
- [让每个文章都显示](#让每个文章都显示)
    - [修改post.html文件](#修改posthtml文件)
    - [效果展示](#效果展示)

<!-- /TOC -->


# 修改_config.yml文件

在`_config.yml`文件添加一行代码，代码如下：
```
# 添加category内容
permalink: /:categories/:title/
```

为了能够在导航栏进行显示**分类**标签，所以在`_config.yml`这个文件中的导航代码中添加分类栏，代码如下：
```html
# List of links in the navigation bar
navbar-links:
  主页: "https://zoharandroid.github.io"
  分类: "https://zoharandroid.github.io/categories/"
  标签: "https://zoharandroid.github.io/tags/"
  项目:
    - Learn markdown: "http://www.markdowntutorial.com/"
  关于我: "aboutme"
  搜索: "search"
```

# 创建categories.html文件

在根目录下创建爱你一个`categories.html`文件，并将下面的代码复制到这个文件中。

```html
---
layout: page
permalink: /categories/
title: 博客分类
---

<!--添加搜索框-->
<br/>
<!-- HTML elements for search -->
<input type="text" id="search-input" placeholder="搜索博客 - 输入标题/相关内容/日期/Tags.." style="width:380px;"/>
<ul id="results-container"></ul>

<!-- script pointing to jekyll-search.js -->
<script src="\{\{ site.baseurl \}\}/js/simple-jekyll-search.min.js"></script>

<script>
SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
    noResultsText: '没有搜索到文章',
    limit: 20,
    fuzzy: false
  })
</script>
<br/>


<div id="archives">
{\%\for category in site.categories \%\}
  <div class="archive-group">
    {\%\capture category_name \%\}\{\{ category | first \}\}{\%\endcapture \%\}
    <div id="#\{\{ category_name | slugize \}\}"></div>
    <p></p>

    <h3 class="category-head">\{\{ category_name \}\} (\{\{site.categories[category_name].size()\}\})</h3>
    <a name="\{\{ category_name | slugize \}\}"></a>
    {\%\for post in site.categories[category_name] \%\}
    <article class="archive-item">
      <h4><a href="\{\{ site.baseurl \}\}\{\{ post.url \}\}">\{\{ post.title \}\}</a></h4>
    </article>
    {\%\endfor \%\}
  </div>
{\%\endfor \%\}
</div>
```
> 这里我也添加了搜索功能，如果不想要的可以删除搜索的代码。

# 对每个文章进行分类的添加

修改_post目录下的`.md`文件，然后在开头添加`categories: `标签，好让分类页面去一起展示。添加的示例如下
```md
---
layout: post
title: Jekyll个人博客添加分类Category功能
tags: [Jekyll]
categories: Jekyll
---
```

# 结果展示

到这里分类页面也就完成了。

![](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/%E5%88%86%E7%B1%BB%E5%B1%95%E7%A4%BA.png?raw=true)

# 让每个文章都显示

然而，这里添加个附加功能，让每个文章都能够显示出是出于哪个分类之中，那么如何实现这个功能呢？

## 修改post.html文件

打开`_layout/post.html`文件，然后在中间部分找到**tags**的字符，然后在`\{\% endif \%\}`后面一行添加代码，添加完后的代码如下：

```html
 <!--文章尾部添加tags-->
      {\%\if page.tags.size > 0 \%\}
        <div class="blog-tags">
          Tags:
          {\%\if site.link-tags \%\}
          {\%\for tag in page.tags \%\}
            <a href="\{\{ '/tags' | relative_url \}\}#\{\{- tag -\}\}">\{\{- tag -\}\}</a>
          {\%\endfor \%\}
          {\%\else \%\}
            \{\{ page.tags | join: ", " \}\}
          {\%\endif \%\}
        </div>
      {\%\endif \%\}

	<!--添加分类-->
	 {\%\if page.categories.size > 0 \%\}
		  <div class="blog-tags">
		  Category：
		{\%\if post \%\}
			{\%\assign categories = post.categories \%\}
		{\%\else \%\}
			{\%\assign categories = page.categories \%\}
		{\%\endif \%\}
		{\%\for category in categories \%\}
			<a href="\{\{site.baseurl\}\}/categories/#\{\{category|slugize\}\}">\{\{category\}\}</a>
			{\%\unless forloop.last \%\}&nbsp;{\%\endunless \%\}
			{\%\endfor \%\}
		</div>
	{\%\endif \%\}
```

## 效果展示

![](https://github.com/ZoharAndroid/MarkdownImages/blob/master/2019-08/%E5%88%86%E7%B1%BB%E5%B0%BE%E9%83%A8.png?raw=true)


**如需转载，请附上链接：https://zoharandroid.github.io/ 。**