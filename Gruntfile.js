module.exports = function (grunt) {

    grunt.initConfig({
        mochaTest: {
            test: {
                src: ['tests/**/*.js']
            }
        },

        watch: {
            tests: {
                files: ['tests/**/*.js'],
                tasks: ['mochaTest']
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        nodemon: {
            dev: {
                script: 'examples/app.js',
                options: {
                    ignore: ['node_modules/**', 'examples/**', 'tests/**']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent:dev']);
};