module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
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
        boss: true,
        eqnull: true
      },
      globals: {
        exports: true,
        module: false
      }
    },
    uglify: {},
    jasmine_node: {
      specNameMatcher: "./spec", // load only specs containing specNameMatcher
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');

  // Default task.
  grunt.registerTask('default', 'lint jasmine_node test concat min');

};
