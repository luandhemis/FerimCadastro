let a = 'aspas""simples'
let b = "aspas ''duplas"
let nome = '1berto'
let idade = 20
let c = `Nome = ${nome} kek idade = ${idade} kek`
let d = 'Nome = ' + nome + ' kek idade = '+ idade + 'kek'
let e = `Nome : ${kek()} e idade=${idade}`
console.log(e)

async function kek () {
    nome = 'humberto'
    return nome
}
