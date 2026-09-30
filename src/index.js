const express = require('express');
const { resolve } = require('node:dns');
const fs = require('node:fs/promises');
const path = require('node:path');
const app = express();
const port = Number(process.env.PORT) || 3000;

const pathToFile = path.join(__dirname, '..', 'products.json');

const cache={}
async function readmyFile(){
    try{
        let data = await fs.readFile(pathTofile, 'utf-8')
        const items = JSON.parse(data)
        return items
    }catch(err){
        console.log(err)
    }
}

async function readFileWithDelay() {
    await new Promise((resolve, reject)=>{ setTimeout(resolve,1500) })
    let products = await readmyFile()
    return products

}



app.get('/products',async (req,res)=>{
    try{
        let key = req.url
        let val = cache[key]
        if (val){
            return res.json(val)
        }
        let products = await readFileWithDelay()
        cache[key]= products
        res.json(products)
    }catch(err){
        console.log(err)
    }

})
app.get('/products/:id',async (req,res)=>{
    try{
        let products = await readFileWithDelay()
        let {id} = req.params
        id = Number(id)
        products = products.find((item)=>{return item.id = id})
        res.json(products)
    }catch(err){
        console.log(err)
    }

})


app.listen(3000)