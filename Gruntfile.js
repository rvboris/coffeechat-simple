module.exports = function (grunt) {

    var version = function() {
        return grunt.file.readJSON('package.json').version || '1.0.0';
    };

    var randomString = function () {
        return Math.random().toString(36).substring(7);
    };

    var cdnHost = 'cdn.coffeechat.ru';
    var cssFileName = randomString() + '.css';
    var jsFileName = randomString() + '.js';
    
    var jsMinConfig = {};
    var cssMinConfig = {};

    jsMinConfig['public/js/' + jsFileName] = 'src/js/compiled/require.js';

    cssMinConfig.main = {};
    cssMinConfig.main.files = {};
    cssMinConfig.main.files['public/css/' + cssFileName] = 'public/css/' + cssFileName;
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-mincss');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-wrap');

    grunt.initConfig({
        clean: {
            build: [
                'public/css/*.css',
                'public/js/*.js',
                'public/*.html',
                'src/stylus/compiled/*.css',
                'src/js/compiled/*.js'
            ]
        },
        
        jshint: {
            main: ['src/js/config.js', 'src/js/app/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                globals: {
                    require: true,
                    define: true,
                    console: true,
                    Templates: true
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/stylus/*.styl', 'src/css/*.css', 'src/jade/*.jade'],
                tasks: ['stylus', 'concat:styles', 'jade:development', 'mincss'],
            }
        },

        stylus: {
            main: {
                options: {
                    compress: true,
                },
                files: {
                    'src/stylus/compiled/style.css': 'src/stylus/*.styl'
                }
            }
        },
        
        requirejs: {
            main: {
                options: {
                    name: 'config',
                    out: 'src/js/compiled/require.js',
                    baseUrl: 'src/js/',
                    mainConfigFile: 'src/js/config.js',
                }
            }
        },

        handlebars: {
            main: {
                options: {
                    namespace: 'Templates',
                    wrapped: true,
                    processName: function(filePath) {
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1].split('.')[0];
                    }
                },
                files: {
                    'src/js/compiled/templates.js': 'src/js/handlebars/*.hbs'
                }
            }
        },

        wrap: {
            modules: {
                src: 'src/js/compiled/templates.js',
                dest: '.',
                wrapper: ['define(["libs/handlebars"], function (Handlebars) {', 'return this.Templates;});']
            }
        },

        jade: {
            development: {
                options: {
                    data: {
                        env: 'development',
                        version: version,
                        cssFileName: cssFileName
                    }
                },
                files: {
                    'public/index.html': 'src/jade/index.jade'
                }
            },
            production: {
                options: {
                    data: {
                        env: 'production',
                        cdnHost: cdnHost,
                        version: version,
                        jsFileName: jsFileName,
                        cssFileName: cssFileName
                    }
                },
                files: {
                    'public/index.html': 'src/jade/index.jade'
                }
            }
        },

        uglify: jsMinConfig,
        mincss: cssMinConfig,

        concat: {
            styles: {
                src: [
                    'src/css/*.css',
                    'src/stylus/compiled/*.css'
                ],
                dest: 'public/css/' + cssFileName
            },
            scripts: {
                src: [
                    'src/js/libs/require.js',
                    'src/js/compiled/require.js',
                ],
                dest: 'src/js/compiled/require.js'
            },
            scriptsDebug: {
                src: [
                    'src/js/libs/require.js',
                    'src/js/compiled/require.js',
                ],
                dest: 'public/js/' + jsFileName
            },
        }
    });

    grunt.registerTask('main', ['clean:build', 'jshint', 'stylus', 'concat:styles', 'handlebars', 'wrap']);
    grunt.registerTask('development', ['main', 'bump', 'jade:development', 'mincss']);
    grunt.registerTask('production', ['main', 'jade:production', 'requirejs', 'concat:scripts', 'uglify', 'mincss']);
    grunt.registerTask('production-debug', ['main', 'jade:production', 'requirejs', 'concat:scriptsDebug', 'mincss']);
};