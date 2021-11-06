
const {generateTemplateFiles} = require('generate-template-files');

generateTemplateFiles([
    {
        option: 'Create Model List View',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/ListView',
        },
        stringReplacers: ['__model__'],
        output: {
            path: './src/views/__model__.List__model__',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Model Create View',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/CreateView',
        },
        stringReplacers: ['__model__'],
        output: {
            path: './src/views/__model__s.CreateForm',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Model Update View',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/UpdateView',
        },
        stringReplacers: ['__model__'],
        output: {
            path: './src/views/__model__s.UpdateForm',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Form Component',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/FormComponent',
        },
        stringReplacers: ['__model__'],
        output: {
            path: './src/components/__model__Form',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Generic View',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/GenericView',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/views/__name__',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Modal',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/Modal',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/components/Modals/__name__Modal',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Generic Component',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/GenericComponent',
        },
        stringReplacers: ['__name__'],
        output: {
            path: './src/components/__name__',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },
    {
        option: 'Create Model',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './tools/templates/__model__.d.ts',
        },
        stringReplacers: ['__model__'],
        output: {
            path: './src/@types/__model__.d.ts',
            pathAndFileNameDefaultCase: '(pascalCase)',
        },
        onComplete: (results) => {
            console.log(`results`, results);
        },
    },

]);