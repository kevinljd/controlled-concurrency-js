const app = require('../app.js');

test('test example function', () => {
    expect(app.example(1,2)).toBe(3);
})