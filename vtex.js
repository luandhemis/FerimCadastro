const puppeteer = require('puppeteer');
const fs = require('fs');
let { produtos } = require('./produtos.js');
const { BlockList } = require('net');
let produtosComErro = [];
let produtosTratados = [];
let indice = '';    
let qualidade = 80;
let pasta = './JAVASCRIPT/ImagensVTEX/Imagens/';
let produtosAlternativos_erro = [];


const pegarImagens = async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null});
    const page = await browser.newPage();
    try {
        await baixarImagens(produtos, page)
    } catch (e) { //Erro de screenshot (provavelmente é webp)
    }
    if (produtosComErro.length > 0) {
        console.log('---------------------------------------------------------------------------------')
        console.log('Os produtos abaixo deram erro pelo método padrão, vamos tentar o modo alternativo')
        console.table(produtosComErro)
        await downloadAlternativo(produtosComErro)
        await baixarImagensAlternativo(produtosTratados)
        if (produtosAlternativos_erro.length > 0) {
            console.log('---------------------------------------------------------------------------------')
            console.log('Alguns produtos deram erro via método alternativo, lista abaixo')
            console.table(produtosAlternativos_erro)
        }
    } else {
        console.log('Todas imagens baixadas com sucesso!')
    }
    browser.close()
}
pegarImagens()

const baixarImagens = async (produtos, page) => { //1
    browser = await puppeteer.launch({ headless: false, defaultViewport: null});
    page = await browser.newPage();
    await page.setViewport({ width:45, height: 100 })
    for (let i = 0; i < produtos.length; i++) {
        try { 
            await page._client.send('Page.setDownloadBehavior', { behavior: 'deny' });
            await page.goto(produtos[i][2].toString(), { waitUntil: 'networkidle2' })
            const body = await page.$('body')
            const imagem = await page.$('img')
            await body.evaluate((el) => el.style.backgroundColor = 'orange')
            await imagem.evaluate((el) => el.style.backgroundcolor = 'white')
            await imagem.evaluate((el) => el.style.objectFit = 'contain')
            await imagem.evaluate((el) => el.style.transition = 'none')            
            await imagem.evaluate((el) => el.style.height = '1000px')
            await imagem.evaluate((el) => el.style.width = '1000px') 
            
            await imagem.evaluate((el) => el.style.backgroundColor = '#ffffff')
            const dir = pasta + produtos[i][1].toString()
            try {
                fs.mkdirSync(dir)
            } catch (e) {
            }
            await page.waitFor(1000)
            await imagem.evaluate((el) => el.style.backgroundcolor = '#ffffff')
            await imagem.screenshot({ path: pasta + produtos[i][1].toString() + '/' + produtos[i][0].toString() + indice + '.jpg', quality: qualidade })
            console.log('---------------------------------------------------------------------------------')
            console.log('Produto ' + (i + 1) + ' concluído com êxito!')
        } catch (e) {
            console.log('---------------------------------------------------------------------------------')
            console.log('Erro no produto ' + (i + 1))
            let nomeImagem = produtos[i][0].toString()
            let marca = produtos[i][1].toString()
            let url = produtos[i][2].toString()
            produtosComErro.push({ nomeImagem, marca, url })
        }
    }
    browser.close()
}

const downloadAlternativo = async (page) => { //2
    browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    page = await browser.newPage();
    await page.setViewport({ width:45, height: 100, backgroundColor:'white'})
    for (let i = 0; i < produtosComErro.length; i++) {
        let nomeImagem = produtosComErro[i].nomeImagem
        let marca = produtosComErro[i].marca
        let url = produtosComErro[i].url
        try {
            await page.goto('https://imgbb.com/', { waitUntil: 'networkidle2' })
            await page.waitForSelector('#top-bar > div > ul.top-bar-right.float-right.keep-visible > li.pop-btn > span > span.btn-text.phone-hide.phablet-hide')
            await page.click('#top-bar > div > ul.top-bar-right.float-right.keep-visible > li.pop-btn > span > span.btn-text.phone-hide.phablet-hide')
            await page.waitFor(4000)
            await page.waitForSelector('#anywhere-upload > div.content-width > div > div.upload-box-heading.c16.center-box > div > div:nth-child(1) > div.upload-box-status-text > a:nth-child(2)')
            await page.click("[data-group='upload'] a[data-modal]")
            await page.waitForSelector('#fullscreen-modal-body > div > textarea')
            await page.focus('#fullscreen-modal-body > div > textarea')
            await page.keyboard.type(url)
            await page.click('#fullscreen-modal-box > form > div.btn-container > button')
            await page.waitForSelector('#upload-expiration', { timeout: 5000 })
            await page.select('#upload-expiration', 'PT5M')
            await page.waitForSelector('#anywhere-upload-queue')
            await page.waitFor(3000)
            await page.click('#anywhere-upload-submit > div:nth-child(1) > button')
            await page.waitFor(3000)
            await page.waitForSelector('#anywhere-upload-queue > li > a')
            let link = await page.evaluate(() => {
                return document.querySelector('#anywhere-upload-queue > li > a').getAttribute('href')
            })
            await page.goto(link)
            await page.waitForSelector('#image-viewer-container > img')
            let linkImagem = await page.evaluate(() => {
                return document.querySelector('#image-viewer-container > img').getAttribute('src')
            })
            produtosTratados.push({ nomeImagem, marca, linkImagem })
        } catch (e) {
            produtosAlternativos_erro.push({ nomeImagem, marca, url })
        }
    }
    browser.close()
}

const baixarImagensAlternativo = async (page) => { //3
    browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    page = await browser.newPage();
    await page.setViewport({ width:45, height: 100, backgroundColor:'white' })
    for (let i = 0; i < produtosTratados.length; i++) {
        try {
            await page._client.send('Page.setDownloadBehavior', { behavior: 'deny' });
            console.log('Pegando produto ' + (i + 1) + ' pelo método alternativo...')
            await page.goto(produtosTratados[i].linkImagem, { waitUntil: 'networkidle2' })
            const body = await page.$('body')
            const imagem = await page.$('img')
            await body.evaluate((el) => el.style.backgroundColor = 'white')
            await imagem.evaluate((el) => el.style.backgroundColor = 'white')
            await imagem.evaluate((el) => el.style.objectFit = 'contain')
            await imagem.evaluate((el) => el.style.height = '1000px')
            await imagem.evaluate((el) => el.style.width = '1000px')
            const dir = pasta + produtosTratados[i][1]
            try {
                fs.mkdirSync(dir)
            } catch (e) {
            }
            await imagem.screenshot({ path: pasta + produtosTratados[i].marca + '/' + produtosTratados[i].nomeImagem + indice + '.jpg', quality: qualidade })
            console.log('Produto ' + (i + 1) + ' concluído com êxito!')
        } catch (e) {
            console.log('---------------------------------------------------------------------------------')
            console.log('Erro inesperado, entre em contato com o desenvolvedor do programa')
            console.log(e)
        }
    }
    browser.close()
}
