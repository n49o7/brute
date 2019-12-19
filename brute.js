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

    compilePath: function (path) {
        x = path.split(/"|\[|\]|(\[\\*["'])|(\\*["']\])|\./g)
        y = [...x.slice(1)].filter(i => /[\w+]/g.test(i) && i !== undefined)
        z = y.map(i => '["'+i+'"]')
        return [x[0], ...z].join('')
    },

    compileCondition: function (iterate, item, condition) {
        x = condition.split(/(\s*&&\s*|\s*\|\|\s*)/)
        y = x.map(e => !/(&&|\|\|)/g.test(e) ? /_/g.test(e) ? e.replace('_', "'"+item+"'") : Brute.compilePath(iterate+'.'+item)+'.'+e : e )
        return y.join('')
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
                let test = Brute.compileCondition(iterate, item, condition)
                if (eval(test)) {
                    let node = document.importNode(template, true)
                    let cells = node.querySelectorAll(`[data-${keywords.bind}]`)
                    cells.forEach(cell => {
                        let oldBind = cell.getAttribute(`data-${keywords.bind}`)
                        let newBind = ''
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
            if (bind.length > 0) {
                let result = Brute.scopedEval(bind)
                el.innerHTML = result
            }
        })
    },

    fill: function () {
        Brute.fillArrays()
        Brute.fillItems()
    }

}