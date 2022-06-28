import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig(({command})=>{
  if (command==='build'){
    //生产模式 , 只设置了443端口
    return {
      plugins: [
        vue(),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
      logLevel:"warn",
      host:'0.0.0.0',
      cors: true,
      base: "https://www.tenyear.cn/",
      server:{
        port: 443,
        proxy: {    //设置代理，必填项
          '/api': {    //拦截器格式
            target: 'https://www.tenyear.cn:8082/',
            changeOrigin: true, //设置同源
            rewrite: path => {
              return path.replace('/api', '')
            },
          }
        },
      },
      esbuild:{
        charset:'utf8',
        sourcemap:false,

      },
      build:{
        sourcemap:false,
      }
    }
  }else {
//开发模式
    return {
      plugins: [
        vue(),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
      base: 'http://localhost/',
      server:{
        port:9999,
        proxy: {    //设置代理，必填项
          '/api': {    //拦截器格式
            target: 'http://localhost:8082/',
            changeOrigin: true, //设置同源
            rewrite: path => {
              return path.replace('/api', '')
            }
          }
        },
      }
    }
  }
})
