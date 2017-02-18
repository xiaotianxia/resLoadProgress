(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(factory);
    } else if (typeof exports === 'object') {
        //Node, CommonJS之类的
        module.exports = factory();
    } else {
        //浏览器全局变量(root 即 window)
        root.ResLoader = factory(root);
    }
}(this, function () {
    var isFunc = function(f) {
        return typeof f === 'function';
    };
    function ResLoader(config){
        this.option = {
            baseUrl : './', //基准url
            resources : [], //资源路径数组
            onStart : null, //加载开始回调函数，传入参数total
            onProgress : null, //正在加载回调函数，传入参数currentIndex, total
            onComplete : null //加载完毕回调函数，传入参数total
        };
        if(config) {
            for(i in config) {
                this.option[i] = config[i];
            }
        } else {
            alert('参数错误！');
            return;
        }
        this.total = 0; //资源总数
        this.currentIndex = 0; //当前正在加载的资源索引
        this.resources = this.option.resources;

        this.start();
    };

    ResLoader.prototype.start = function(){
        var self = this,
            resources = this.resources;
        for(i in resources) {
            var resource = resources[i],
                type = resource.type,
                files = resource.files;
            this.fixFileUrl(i);
            this.onloadFile(type, files);
        }
        if(isFunc(this.option.onStart)) {
            this.option.onStart(this.total);
        }
    }

    ResLoader.prototype.fixFileUrl = function(index) {
        var baseUrl = this.option.baseUrl,
            files = this.resources[index].files;
        for(i in files) {
            var file = files[i];
            if(file.indexOf('http://') === 0 || file.indexOf('https://') === 0) {
                url = file;
            } else {
                url = baseUrl + file;
            }
            this.resources[index].files[i] = url;
        }        
    }

    ResLoader.prototype.onloadFile = function(type, files) {
        var self = this;
        this.total += files.length;
        switch(type) {
            case 'image': 
                for(i in files) {
                    var image = new Image();
                    image.onload = image.onerror = function() {
                        self.loaded();
                    };
                    image.src = files[i];
                }
                break;
            case 'audio': 
                for(i in files) {
                    var audio = new Audio(files[i]);
                    audio.onloadedmetadata = function() {
                        self.loaded();
                    };
                    audio.src = files[i];
                }
                break;
            case 'video': 
                for(i in files) {
                    var video = new Audio(files[i]);
                    video.onloadedmetadata = function() {
                        self.loaded();
                    };
                    video.src = files[i];
                }
                break;
        }
    }

    ResLoader.prototype.loaded = function() {
        if(isFunc(this.option.onProgress)) {
            this.option.onProgress(++this.currentIndex, this.total);
        }
        //加载完毕
        if(this.currentIndex === this.total) {
            if(isFunc(this.option.onComplete)) {
                this.option.onComplete(this.total);
            }
        }
    }

    return ResLoader;
}));