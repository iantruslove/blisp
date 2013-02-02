module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-coffee');

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
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'spec/**/*.js', 'generated_spec/**/*.js']
    },
    watch: {
      dev: {
        files: '<config:lint.files>',
        tasks: 'lint jasmine_node'
      },
      coffee: {
        files: '**/*.coffee',
        tasks: 'coffee'
      }
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
        console: true,
        require: true,
        exports: true,
        module: false,
        describe: true,
        it: true,
        xit: true,
        expect: true,
        beforeEach: true
      }
    },
    uglify: {},
    coffee: {
      spec: {
        files: {
          'generated_spec/*.js': 'spec/**/*.coffee'
        },
        options: {
          bare: false
        }
      }
    },
    jasmine_node: {
      spec: ["./spec", './generated_spec'], // load only specs containing specNameMatcher
      projectRoot: ".",
      requirejs: false,
      forceExit: false,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });


  // Default task.
  grunt.registerTask('default', 'lint jasmine_node concat min');

};
