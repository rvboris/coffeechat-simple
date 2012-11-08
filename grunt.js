module.exports = function (grunt) {

    var cdnHost = 'cdn.coffeechat.ru';

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
                        version: function() {
                            return grunt.file.readJSON('package.json').version || '1.0.0';
                        }
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
                        version: function() {
                            return grunt.file.readJSON('package.json').version || '1.0.0';
                        }
                    }
                },
                files: {
                    'public/index.html': 'src/jade/index.jade'
                }
            }
        },

        min: {
            'public/js/require.js': 'src/js/compiled/require.js'
        },

        mincss: {
            main: {
                files: {
                    'public/css/style.css': 'public/css/style.css'
                }
            }
        },

        concat: {
            styles: {
                src: [
                    'src/less/compiled/*.css',
                    'src/stylus/compiled/*.css'
                ],
                dest: 'public/css/style.css'
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

    grunt.registerTask('main', 'clean bump lint stylus less concat:styles');
    grunt.registerTask('development', 'main jade:development mincss');
    grunt.registerTask('production', 'main jade:production requirejs concat:scripts min mincss');
};