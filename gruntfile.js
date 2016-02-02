'use strict';

var CONFIG = require('./parameters.json');
var server = CONFIG.server;



// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        app: {
            dev: 'www',
            pro: 'dist'
        },
        appcache: {
            options: {
                basePath: '<%= app.dev %>/'
            },
            all: {
                dest: '<%= app.dev %>/assets/coke.appcache',
                cache: '<%= app.dev %>/assets/**/*',
                network: '*'
            }
        },
        ngconstant: {
            options: {
                name: 'core.config',
                dest: '<%= app.dev %>/app/core/core.config.js',
                wrap: "(function() { 'use strict'; \n  {%= __ngModule %} \n\n})();",
                constants: {
                    HEADER: 'WEB_CLIENT_1.0.0',
                    LANGUAGE_DEFAULT: 'es'
                }
            },
            dist: {
                constants: CONFIG[CONFIG.server].constants
            }
        },
        // Empties folders to start fresh
        clean: {
            pro: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= app.pro %>/*',
                        '!<%= app.pro %>/.git*'
                    ]
                }]
            },
            templates: {
                files: [{
                    dot: true,
                    src: [
                        '<%= app.pro %>/templates'
                    ]

                }]
            },
            server: '.tmp'
        },
        useminPrepare: {
            html: '<%= app.dev %>/index.html',
            options: {
                dest: '<%= app.pro %>',
                flow: {
                    steps: {'js': ['concat'], 'css': ['concat']},
                    post: {}
                }
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= app.pro %>']
            },
            html: ['<%= app.pro %>/{,*/}*.html'],
            css: ['<%= app.pro %>/assets/css/{,*/}*.css']
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles'
            ]
        },

        // CSS Min

        cssmin: {
            dist: {
                expand: true,
                cwd: '<%= app.pro %>/assets/css/',
                src: ['*.css'],
                dest: '<%= app.pro %>/assets/css/'
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                expand: true,
                src: ['<%= app.pro %>/assets/js/app.js', '<%= app.pro %>/assets/js/vendor.js']
            }
        },

        // Uglify
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                expand: true,
                cwd: '<%= app.pro %>/assets/js/',
                src: ['*.js'],
                dest: '<%= app.pro %>/assets/js/'
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= app.dev %>',
                    dest: '<%= app.pro %>',
                    src: [
                        '*.{ico,png,txt}',
                        '{,*/}*.html',
                        'assets/css/fonts/{,*/}*.*',
                        'assets/img/{,*/}*.*',
                        'assets/data/{,*/}*.*'
                    ]
                }]
            },
            full: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= app.dev %>',
                    dest: '<%= app.pro %>',
                    src: '**'
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= app.dev %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            }
        },

        /// Generate template Cache for Angular
        html2js: {
            options: {
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                module: 'core.templates',
                base: '<%= app.dev %>',
                useStrict: true
            },
            main: {
                src: ['<%= app.dev %>/app/components/**/{,*/}*.html', '<%= app.dev %>/app/components/**/**/{,*/}*.html', '<%= app.dev %>/app/core/views/{,*/}*.html', '<%= app.dev %>/app/shared/**/{,*/}*.html'],
                dest: '<%= app.dev %>/app/core/core.templates.js'
            }
        },
        exec: {
            bower : {
                command : 'node_modules/.bin/bower install',
                cwd : '',
                stdout : true,
                stderr : true
            },
            forever_stop : {
                command : 'node_modules/.bin/forever stop index.js || true',
                stdout : true,
                stderr : true
            }
        },
        browserSync: {
            bsFiles: {
                src : '<%= app.dev %>/**'
            },
            options: {
                server: {
                    baseDir: "<%= app.dev %>/"
                }
            }
        }
    });

    grunt.registerTask('serve', ['browserSync'])


    grunt.registerTask('prepare', [
        'clean:pro',
        'ngconstant',
        'appcache',
        'html2js',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'cssmin',
        'copy:dist',
        'usemin',
        'uglify',
        'clean:templates'
    ]);




};
