let Brute = {

    pathResult: function (path) {
        x = path.split(/(\[\\*["'])|(\\*["']\])|\./g)
        y = [...x.slice(1)].filter(i => /[\w+]/g.test(i) && i !== undefined)
        z = y.map(i => '["'+i+'"]')
        path = [x[0], ...z].join('')
        return Function(`'use strict'; return (${path})`)()
    },

    fillArrays: function (target=document) {
        let els = target.querySelectorAll('[data-iterate]')
        els.forEach(el => {
            el.innerHTML = ''
            let iterate = el.getAttribute('data-iterate')
            let branch = Brute.pathResult(iterate)
            let type = branch.constructor.name
            let templateName = el.getAttribute('data-template')
            let template = Brute.pathResult(templateName).content
            Object.keys(branch).forEach(item => {
                let node = document.importNode(template, true)
                let cells = node.querySelectorAll('[data-bind]')
                cells.forEach(cell => {
                    let oldBind = cell.getAttribute('data-bind')
                    let newBind = ''
                    if (/^[_]$/g.test(oldBind) && type == 'Object') {
                        cell.innerHTML = item
                    } else if (/^[_]$/g.test(oldBind) && type == 'Array') {
                        newBind = iterate+'['+item+']'
                    } else {
                        newBind = iterate+'["'+item+'"]'+'["'+oldBind+'"]'
                    }
                    cell.setAttribute('data-bind', newBind)
                })
                el.append(node)
            })
        })
    },

    fillItems: function (target=document) {
        let els = target.querySelectorAll('[data-bind]')
        els.forEach(el => {
            let bind = el.getAttribute('data-bind')
            if (bind.length > 0) {
                let result = Brute.pathResult(bind)
                el.innerHTML = result
            }
        })
    },

    fill: function () {
        Brute.fillArrays()
        Brute.fillItems()
    }

}