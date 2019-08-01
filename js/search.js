/ 获取搜索框、搜索按钮、清空搜索、结果输出对应的元素
var searchBtn = document.querySelector('.search-start');
var searchClear = document.querySelector('.search-clear');
var searchInput = document.querySelector('.search-input');
var searchResults = document.querySelector('.search-results');

// 申明保存文章的标题、链接、内容的数组变量
var searchValue = '',
    arrItems = [],
    arrContents = [],
    arrLinks = [],
    arrTitles = [],
    arrResults = [],
    indexItem = [];
var tmpDiv = document.createElement('div');
tmpDiv.className = 'result-item';

// ajax 的兼容写法
var xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        xml = xhr.responseXML;
        arrItems = xml.getElementsByTagName('item');
        
        // 遍历并保存所有文章对应的标题、链接、内容到对应的数组中
        for (i = 0; i < arrItems.length; i++) {
            arrContents[i] = arrItems[i].getElementsByTagName('description')[0].childNodes[0].nodeValue;
            arrLinks[i] = arrItems[i].getElementsByTagName('link')[0].childNodes[0].nodeValue.replace(/\s+/g, '');
            arrTitles[i] = arrItems[i].getElementsByTagName('title')[0].childNodes[0].nodeValue;
        }
    }
}

// 开始获取根目录下 feed.xml 文件内的数据
xhr.open('get', '/feed.xml', true);
xhr.send();

searchBtn.onclick = searchConfirm;

// 清空按钮点击函数
searchClear.onclick = function(){
    searchInput.value = '';
    searchResults.style.display = 'none';
    searchClear.style.display = 'none';
}

// 输入框内容变化后就开始匹配，可以不用点按钮
searchInput.onkeydown = function () {
    setTimeout(searchConfirm, 0);
}
searchInput.onfocus = function () {
    searchResults.style.display = 'block';
}

function searchConfirm() {
    if (searchInput.value == '') {
        searchResults.style.display = 'none';
        searchClear.style.display = 'none';
    } else if (searchInput.value.search(/^\s+$/) >= 0) {
    
        // 检测输入值全是空白的情况
        searchInit();
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '请输入有效内容...';
        searchResults.appendChild(itemDiv);
    } else {
    
        // 合法输入值的情况
        searchInit();
        searchValue = searchInput.value;
        searchMatching(arrContents, searchValue);
    }
}

// 每次搜索完成后的初始化
function searchInit() {
    arrResults = [];
    indexItem = [];
    searchResults.innerHTML = '';
    searchResults.style.display = 'block';
    searchClear.style.display = 'block';
}

function searchMatching(arr, input) {

    // 在所有文章内容中匹配查询值
    for (i = 0; i < arr.length; i++) {
        if (arr[i].search(input) != -1) {
            indexItem.push(i);
            var indexContent = arr[i].search(input);
            var l = input.length;
            var step = 10;
            
            // 将匹配到内容的地方进行黄色标记，并包括周围一定数量的文本
            arrResults.push(arr[i].slice(indexContent - step, indexContent) +
                '<mark>' + arr[i].slice(indexContent, indexContent + l) + '</mark>' +
                arr[i].slice(indexContent + l, indexContent + l + step));
        }
    }

    // 输出总共匹配到的数目
    var totalDiv = tmpDiv.cloneNode(true);
    totalDiv.innerHTML = '总匹配：<b>' + indexItem.length + '</b> 项';
    searchResults.appendChild(totalDiv);

    // 未匹配到内容的情况
    if (indexItem.length == 0) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerText = '未匹配到内容...';
        searchResults.appendChild(itemDiv);
    }

    // 将所有匹配内容进行组合
    for (i = 0; i < arrResults.length; i++) {
        var itemDiv = tmpDiv.cloneNode(true);
        itemDiv.innerHTML = '<b>《' + arrTitles[indexItem[i]] +
            '》</b><hr />' + arrResults[i];
        itemDiv.setAttribute('onclick', 'changeHref(arrLinks[indexItem[' + i + ']])');
        searchResults.appendChild(itemDiv);
    }
}

function changeHref(href) {

    // 在当前页面点开链接的情况
    location.href = href;

    // 在新标签页面打开链接的代码，与上面二者只能取一个，自行决定
    // window.open(href);
}