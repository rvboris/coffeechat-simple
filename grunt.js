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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-mincss');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bump');

    grunt.initConfig({
        clean: [
            'public/css/*.css',
            'public/js/*.js',
            'public/*.html',
            'src/stylus/compiled/*.css',
            'src/less/compiled/*.css',
            'src/js/compiled/*.js',
        ],

        lint: {
            files: [
                'src/js/config.js',
                'src/js/app/*.js'
            ]
        },

        jshint: {
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
                browser: true
            },
            globals: {
                require: true,
                define: true,
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

        less: {
            main: {
                options: {
                    yuicompress: true
                },
                files: {
                    'src/less/compiled/modern.css': 'src/less/modern.less',
                    'src/less/compiled/modern-responsive.css': 'src/less/modern-responsive.less',
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

        min: jsMinConfig,
        mincss: cssMinConfig,

        concat: {
            styles: {
                src: [
                    'src/less/compiled/*.css',
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
            }
        }
    });

    grunt.registerTask('main', 'clean lint stylus less concat:styles');
    grunt.registerTask('development', 'main bump jade:development mincss');
    grunt.registerTask('production', 'main jade:production requirejs concat:scripts min mincss');
};