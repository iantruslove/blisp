module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>' + "\n" +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
    },
    clean: ['dist'],
    concat: {
      options: {
        separator: ";",
        stripBanners: true,
        banner: '<%= meta.banner %>'
      },
      add_banner: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'lib',
          name: 'blisp',
          optimize: 'none',
          out: 'dist/<%= pkg.name %>.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    watch: {
      dev: {
        files: ['lib/**/*.js', 'spec/**/*.coffee'],
        tasks: ['default']
      }
    },
    jshint: {
      files: ['*.js', '!scratch.js', 'lib/**/*.js', 'spec/**/*.js'],
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
        eqnull: true,
        globals: {
          define: true,
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
      }
    },
    exec: {
      spec: {
        cmd: 'jasmine-node --verbose --coffee spec',
        stdout: true,
        stderr: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['jshint', 'spec']);  // Default task
  grunt.registerTask('dist', ['default', 'concatenate', 'uglify']);
  grunt.registerTask('spec', ['exec:spec']);
  grunt.registerTask('concatenate', ['requirejs', 'concat:add_banner']); // Just using concat to put the nice banner in place...
};
