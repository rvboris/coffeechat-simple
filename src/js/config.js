require.config({
    deps: ['app/app'],
    paths: {
        libs: 'libs',
        models: 'app/models'
    },
    shim: {
        'compiled/templates': {
            exports: 'Templates',
            deps: ['libs/handlebars']
        }
    }
});