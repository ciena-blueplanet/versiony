'use strict'

function join(arr){
    if (Array.isArray(arr)){
        arr = arr.join('.')
    }

    return arr || ''
}

var indexes = {
        major: 0,
        minor: 1,
        patch: 2
    },
    reset = function(){
        this.major = this.minor = this.patch = undefined
    }


module.exports = function(){

    var increments = {
            major: null,
            minor: null,
            patch: null,
            reset: reset,
        },

        parts = {
            major: null,
            minor: null,
            patch: null,
            reset: reset
        },

        maxValues = {
            major: null,
            minor: null,
            patch: null
        },

        shouldSet = function(name, v){
            if (v != null){
                parts[name]      = v
                increments[name] = undefined
            } else {
                increments[name] = true
                parts[name]      = undefined
            }
        },

        setMaxValue = function(name, v){
            maxValues[name] = v
        },

        prepareValue = function(name, array){
            var index = indexes[name]

            if (increments[name]){
                array[index]++
            }
            if (parts[name] != null){
                array[index] = parts[name]
            }
            if (maxValues[name] != null){
                while (array[index] > maxValues[name]){
                    array[index] -= (maxValues[name]+1)
                    array[index-1]++
                }
            }
        },

        files = []

    var model = {
        v     : [],

        parts: parts,
        increments: increments,

        reset: function(){
            files.length  = 0
            this.v.length = 0

            parts.reset()
            increments.reset()
        },

        major : function(v){
            shouldSet('major', v)
        },

        minor : function(v){
            shouldSet('minor', v)
        },

        patch : function(v){
            shouldSet('patch', v)
        },

        maxPatch : function(v){
            setMaxValue('patch', v)
        },

        maxMinor : function(v){
            setMaxValue('minor', v)
        },

        toString : function(){
            return join(this.v)
        },

        file: function(f){
            if (!this.hasFile(f)){
                files.push(f)

                return true
            }
        },

        hasFile: function(f){
            return !!~files.indexOf(f)
        },

        files: function(){
            return files
        },

        set: function(value){
            value = join(value).split('.')
            value.length = 3

            !value[0] && (value[0] = 0)
            !value[1] && (value[1] = 0)
            !value[2] && (value[2] = 0)

            parts.reset()

            this.v = value
        },

        get: function(){
            var value = this.v.slice()

            !value[0] && (value[0] = 0)
            !value[1] && (value[1] = 0)
            !value[2] && (value[2] = 0)

            prepareValue('patch', value)
            prepareValue('minor', value)
            prepareValue('major', value)

            var result = value.map(function(v){
                return parseInt(v, 10)
            })

            result.toString = function(){
                return join(this)
            }

            return result
        }
    }

    return model

}