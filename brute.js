function Brute() {

    function pathResult(path) {
        return Function(`'use strict'; return (${path})`)()
    }

    function fillArrays(target=document) {
        var els = target.querySelectorAll('[data-iterate]')
        els.forEach(el => {
            el.innerHTML = ''
            var bind = el.getAttribute('data-iterate')
            var templateName = el.getAttribute('data-template')
            var template = pathResult(templateName).content
            key = pathResult(bind)
            Object.keys(key).forEach(item => {
                node = document.importNode(template, true)
                cells = node.querySelectorAll('[data-bind]')
                cells.forEach(cell => {
                    var newBind = bind
                    var oldBind = cell.getAttribute('data-bind')
                    if (!/[\._]$/g.test(oldBind)) {
                        newBind += '.'+item+'.'+oldBind
                    } else {
                        newBind += '['+item+']'
                    }
                    cell.setAttribute('data-bind', newBind)
                })
                el.append(node)
            })
        })
    }

    function fillItems(target=document) {
        var els = target.querySelectorAll('[data-bind]')
        els.forEach(el => {
            var bind = el.getAttribute('data-bind')
            result = pathResult(bind)
            el.innerHTML = result
        })
    }

    function fill() {
        fillArrays()
        fillItems()
    }

}