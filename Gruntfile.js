"use strict";

module.exports = function(grunt) {
    
    var serverPort = grunt.option("port") || 9001;

    // project configuration
    grunt.initConfig({
  
        // metadata
        pkg: grunt.file.readJSON('ajax-chain.jquery.json'),
        banner: "/**\n" +
                " * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
                "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                " * Copyright (c) 2013-<%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
                " Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %>\n" +
                " */\n",
        // Task configuration.
        clean: {
            files: ["dist"]
        },
        concat: {
            options: {
            banner: "<%= banner %>",
            stripBanners: true
          },
          dist: {
            src: ["src/jquery.<%= pkg.name %>.js"],
            dest: "dist/jquery.<%= pkg.name %>.js"
          },
        },
        uglify: {
            options: {
                banner: "<%= banner %>"
          },
            dist: {
                src: "<%= concat.dist.dest %>",
                dest: "dist/jquery.<%= pkg.name %>.min.js"
          },
        },
        qunit: {
            files: ["test/**/*.html"]
        },
        connect: {
            server: {
                options: {
                    port: serverPort,
                    keepalive: true,
                    base: ".",
                    open: "http://localhost:" + serverPort + "/test/ajax-chain.html"
                }
            }
        },
        jshint: {
            options: {
                jshintrc: true,
                verbose: true
          },
            gruntfile: {
                src: "Gruntfile.js"
          },
            src: {
                src: ["src/**/*.js"]
          },
            test: {
                src: ["test/**/*.js"]
          },
        },
        watch: {
            gruntfile: {
                files: "<%= jshint.gruntfile.src %>",
                tasks: ["jshint:gruntfile"]
            },
            src: {
                files: "<%= jshint.src.src %>",
                tasks: ["jshint:src", "qunit"]
            },
            test: {
                files: "<%= jshint.test.src %>",
                tasks: ["jshint:test", "qunit"]
          },
        }
    
    });

    // required grunt plugins
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // default task
    grunt.registerTask("default", ["jshint", "qunit", "clean", "concat", "uglify"]);
    grunt.registerTask("test:headless", ["qunit"]);
    grunt.registerTask("test:browser", ["connect"]);

};
