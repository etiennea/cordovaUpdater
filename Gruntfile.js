module.exports = function(grunt) {
	require('./config/globals');
	var pkg = grunt.file.readJSON('package.json');
	grunt.initConfig({
		pkg: pkg,
		zip: {
			build: {
				cwd: '../phonegap/platforms/ios/www/',
				dest: '../builds/build.<%= pkg.version %>.zip',
				src: ['../phonegap/platforms/ios/www/**']
			}
		},
		aws_s3: {
			options: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
				region: process.env.AWS_REGION,
				uploadConcurrency: 5, // 5 simultaneous uploads
				downloadConcurrency: 5 // 5 simultaneous downloads
			},
			upload: {
				options: {
					bucket: process.env.BUCKET,
					differential: true, // Only uploads the files that have changed
					gzipRename: 'ext' // when uploading a gz file, keep the original extension
				},
				files: [{
					expand: false,
					cwd: '../builds',
					src: ['../builds/build.<%= pkg.version %>.zip', '../express/package.json'],
					dest: 'builds/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-aws-s3');
	
	grunt.registerTask('upload', 'Do everything!', [
		'zip:build',
		'aws_s3:upload'
		]);
}
