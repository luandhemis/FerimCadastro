const fs = require("fs")
const puppeteer = require('puppeteer');
const cheerio = require("cheerio")
const request = require("request-promise")
let { links } = require('./links.js');
const { link } = require("fs/promises");
let pasta = './JAVASCRIPT/ImagensVTEX/Imagens/';
let prod = [];
let p = "minicard"
linkimg = []
nome = []

const linkImagem = async (produtos, page) => { 
    browser = await puppeteer.launch({ headless: false, defaultViewport: null});
    page = await browser.newPage();
    await page.setViewport({ width:45, height: 100 })

    for (let i = 0; i < links.length; i++) {
        
        await page.goto("https://"+links[i].toString(), { waitUntil: 'networkidle2' })
        linkimg[i] =   await page.evaluate(() => {
             return document.querySelector('.vtex-store-components-3-x-productImage div img').getAttribute('src');
                
                })  
    }
     await browser.close()
    
    return linkimg

}



linkImagem().then((kek) => {
    //console.table(kek)
    let fileContent = JSON.stringify(kek)
    fs.writeFileSync("./JAVASCRIPT/ImagensVTEX/minicards.json", fileContent)
})

    //* let n = links[i]
        //n = n.replace("https://www.ferimport.com.br/", "")
        //n= n.replace("/p", "")  
        //nome[i]= n
        

/*
const baixarImagens = async (produtos, page) => { //1
    await linkImagem()
    console.log("i'm here")
    browser = await puppeteer.launch({ headless: false, defaultViewport: null});
    page = await browser.newPage();
    await page.setViewport({ width:45, height: 100 })
    for (let i = 0; i < links[i].length; i++) {
            await page.goto(links[i].toString(), { waitUntil: 'networkidle2' })
            const body = await page.$('body')
            const imagem = await page.$('img')
            await body.evaluate((el) => el.style.backgroundColor = 'orange')
            await imagem.evaluate((el) => el.style.objectFit = 'contain')
            await imagem.evaluate((el) => el.style.transition = 'none')            
            await imagem.evaluate((el) => el.style.height = '1000px')
            await imagem.evaluate((el) => el.style.width = '1000px') 
            
            await imagem.evaluate((el) => el.style.backgroundColor = '#ffffff')
            const dir = pasta + "minicard"
            try {
                fs.mkdirSync(dir)
            } catch (e) {
            }
            await page.waitFor(3000)
            await imagem.evaluate((el) => el.style.backgroundcolor = '#ffffff')
            await imagem.screenshot({ path: pasta + "minicard" + '/' + nome[i] + '.jpg', quality: 80 })
            
    }
    browser.close()
}

linkImagem()


const pegarImagens = async () => {
    await baixarImagens()
}

pegarImagens()

*/