let keywords = {
    bind: 'bind',
    iterate: 'iterate',
    template: 'template',
    condition: 'condition'
}

let Brute = {

    scopedEval: function (expression) {
        return Function(`'use strict'; return (${expression})`)()
    },

    testEval: function (test) {
        return test.length > 0 ? Brute.scopedEval(test) : true
    },

    compilePath: function (path) {
        x = path.split(/"|\[|\]|(\[\\*["'])|(\\*["']\])|\./g)
        y = [...x.slice(1)].filter(i => /[\w+]/g.test(i) && i !== undefined)
        z = y.map(i => '["'+i+'"]')
        return [x[0], ...z].join('')
    },

    splitCondition: function (condition) {
        return condition ? condition.split(/(\s*&&\s*|\s*\|\|\s*)/) : []
    },

    compileIterateCondition: function (iterate, item, condition) {
        x = Brute.splitCondition(condition).map(e => !/(&&|\|\|)/g.test(e) ? /_/g.test(e) ? e.replace('_', "'"+item+"'") : Brute.compilePath(iterate+'.'+item)+'.'+e : e )
        return x.join('')
    },

    compileCondition: function (bind, condition) {
        x = Brute.splitCondition(condition).map(e => e.replace('_', bind))
        return x.join('')
    },

    fillArrays: function (target=document) {
        let els = target.querySelectorAll(`[data-${keywords.iterate}]`)
        els.forEach(el => {
            el.innerHTML = ''
            let iterate = el.getAttribute(`data-${keywords.iterate}`)
            let branch = Brute.scopedEval(iterate)
            let type = branch.constructor.name
            let templateName = el.getAttribute(`data-${keywords.template}`)
            let template = Brute.scopedEval(templateName).content
            let condition = el.getAttribute(`data-${keywords.condition}`)
            Object.keys(branch).forEach(item => {
                let test = Brute.compileIterateCondition(iterate, item, condition)
                if (Brute.testEval(test)) {
                    let node = document.importNode(template, true)
                    let cells = node.querySelectorAll(`[data-${keywords.bind}]`)
                    cells.forEach(cell => {
                        let oldBind = cell.getAttribute(`data-${keywords.bind}`)
                        let newBind = oldBind
                        if (/^[_]$/g.test(oldBind) && type == 'Object') {
                            cell.innerHTML = item
                        } else if (/^[_]$/g.test(oldBind) && type == 'Array') {
                            newBind = iterate+'['+item+']'
                        } else {
                            newBind = iterate+'["'+item+'"]'+'["'+oldBind+'"]'
                        }
                        cell.setAttribute(`data-${keywords.bind}`, newBind)
                    })
                    el.append(node)
                }
            })
        })
    },

    fillItems: function (target=document) {
        let els = target.querySelectorAll(`[data-${keywords.bind}]`)
        els.forEach(el => {
            let bind = el.getAttribute(`data-${keywords.bind}`)
            let condition = el.getAttribute(`data-${keywords.condition}`)
            let test = Brute.compileCondition(bind, condition)
            if (bind.length > 0 && bind != '_' && Brute.testEval(test)) {
                let result = Brute.scopedEval(bind)
                el.innerHTML = result
            } else if (bind != '_') {
                el.remove()
            }
        })
    },

    fill: function () {
        Brute.fillArrays()
        Brute.fillItems()
    }

}