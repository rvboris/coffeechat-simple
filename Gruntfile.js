var moment = require('moment');

module.exports = function (grunt) {

    var version = function() {
        return grunt.file.readJSON('package.json').version || '1.0.0';
    };

    var randomString = function () {
        return Math.random().toString(36).substring(7);
    };

    var now = moment().format('HH-mm-ss-DD-MM-YYYY');

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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-sftp-deploy');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-wrap');

    grunt.initConfig({
        deploy: grunt.file.readJSON('deploy/settings.json'),

        clean: {
            build: [
                'public/css/*.css',
                'public/js/*',
                'public/*.html',
                'src/stylus/compiled/*.css',
                'src/js/compiled/*',
                'deploy/*.zip'
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
                tasks: ['stylus', 'concat:styles', 'jade:development', 'cssmin'],
                options: {
                    nospawn: true,
                }
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
            production: {
                options: {
                    name: 'config',
                    out: 'src/js/compiled/app.js',
                    baseUrl: 'src/js/',
                    mainConfigFile: 'src/js/config.js',
                    generateSourceMaps: false,
                    preserveLicenseComments: false,
                    optimize: 'none'
                }
            },
            debug: {
                options: {
                    name: 'config',
                    out: 'src/js/compiled/app.js',
                    baseUrl: 'src/js/',
                    mainConfigFile: 'src/js/config.js',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    optimize: 'none'
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
                src: ['src/js/compiled/templates.js'],
                dest: '.',
                options: {
                    wrapper: ['define(["libs/handlebars"], function (Handlebars) {', 'return this.Templates;});']
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
                        cdnHost: '<%= deploy.cdn %>',
                        version: version,
                        jsFileName: jsFileName,
                        cssFileName: cssFileName
                    }
                },
                files: {
                    'public/index.html': 'src/jade/index.jade'
                }
            },
            debug: {
                options: {
                    data: {
                        env: 'debug',
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
        cssmin: cssMinConfig,

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
                    'src/js/compiled/app.js',
                ],
                dest: 'src/js/compiled/require.js'
            },
        },

        copy: {
            debug: {
                files: [
                    { expand: true, cwd: 'src/js/libs', src: ['require.js'], dest: 'public/js'},
                    { expand: true, cwd: 'src/js/compiled', src: ['app.*'], dest: 'public/js'}
                ]
            },
            awesome: {
                files: [
                    { expand: true, cwd: 'src/css', src: ['font-awesome.css'], dest: 'public/css'},
                ]
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'deploy/coffeechat.ru-' + version() + '.zip'
                },
                files: [
                    { expand: true, cwd: './public', src: ['**'] },
                    { src: ['proxy.js'] }
                ]
            }
        },

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                push: false,
                createTag: false
            }
        },

        'sftp-deploy': {
            main: {
                auth: {
                    host: '<%= deploy.host %>',
                    authKey: 'main'
                },
                src: 'deploy',
                dest: '/tmp',
                exclusions: ['deploy/*.json', 'deploy/*.pem'],
                server_sep: '/'
            }
        },

        sshexec: {
            backup: {
                command: 'mkdir -p <%= deploy.root %>/backups/' + now +
                         ' && cp -r <%= deploy.root %>/public <%= deploy.root %>/backups/' + now +
                         ' && cp <%= deploy.root %>/proxy.js <%= deploy.root %>/backups/' + now,
                options: {
                    host: '<%= deploy.host %>',
                    username: '<%= deploy.username %>',
                    privateKey: grunt.file.read('deploy/key.pem')
                }
            },
            clean: {
                command: 'rm -r <%= deploy.root %>/public',
                options: {
                    host: '<%= deploy.host %>',
                    username: '<%= deploy.username %>',
                    privateKey: grunt.file.read('deploy/key.pem')
                }
            },
            unzip: {
                command: 'unzip /tmp/coffeechat.ru-' + version() + '.zip -d <%= deploy.root %>/public' +
                         ' && mv <%= deploy.root %>/public/proxy.js <%= deploy.root %>/proxy.js',
                options: {
                    host: '<%= deploy.host %>',
                    username: '<%= deploy.username %>',
                    privateKey: grunt.file.read('deploy/key.pem')
                }
            },
            packages: {
                command: '. ~/nvm/nvm.sh && cd <%= deploy.root %> && npm install http-proxy --silent',
                options: {
                    host: '<%= deploy.host %>',
                    username: '<%= deploy.username %>',
                    privateKey: grunt.file.read('deploy/key.pem')
                }
            },
            restart: {
                command: 'supervisorctl restart coffeechat',
                options: {
                    host: '<%= deploy.host %>',
                    username: '<%= deploy.username %>',
                    privateKey: grunt.file.read('deploy/key.pem')
                }
            }
        }
    });

    grunt.registerTask('main', ['clean:build', 'jshint', 'stylus', 'concat:styles', 'handlebars', 'wrap', 'copy:awesome']);
    grunt.registerTask('development', ['main', 'bump', 'jade:development', 'cssmin', 'watch']);
    grunt.registerTask('production', ['main', 'jade:production', 'requirejs:production', 'concat:scripts', 'uglify', 'cssmin']);
    grunt.registerTask('debug', ['main', 'bump', 'jade:debug', 'requirejs:debug', 'copy:debug']);
    grunt.registerTask('default', ['development']);
    grunt.registerTask('deploy', ['production', 'compress', 'sftp-deploy', 'sshexec']);
};