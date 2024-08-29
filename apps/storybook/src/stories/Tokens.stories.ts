import type { Meta, StoryObj } from '@storybook/vue3'

import tokens from '@fiscozen/style/output/global.json'

const meta: Meta = {
  title: 'Tokens',
  tags: ['autodocs'],
}


const template = (token: { name: string, value: string | BoxShadowObjType | BoxShadowObjType[]}, key: string) => `
    <div class="flex w-full items-center justify-between p-4 border border-gray-200">
        <div class="text-gray-800 flex-1 font-medium">${token.name}</div>
        <div class="text-gray-500 flex-1">${typeof token.value === 'string' ? token.value : token.value}</div>
        <div style="flex:2" class="flex justify-end">
            <div v-if="${key === 'color' || key === 'borderColor'}" class="w-24 h-24 rounded-full border-1" style="background-color: ${token.value}"></div>
            <div v-else-if="${key === 'fontSizes'}" style="font-size:${token.value}">Aa</div>
            <div v-else-if="${key === 'fontWeights'}" style="font-weight:${token.value}">Aa</div>
            <div v-else-if="${key === 'lineHeights'}" style="line-height:${token.value}">Aa</div>
            <div v-else-if="${key === 'boxShadow'}" class="w-56 h-56 rounded-lg bg-grey-100" style="box-shadow: ${typeof token.value === 'string' ? '' : convertObjectToBoxShadow(token.value as BoxShadowObjType | BoxShadowObjType[])}"></div>
            <div v-else-if="${key === 'spacing'}" class="h-12 bg-gray-300" style="width: ${token.value}"></div>
            <div v-else-if="${key === 'textDecoration'}" style="text-decoration: ${token.value}">Aa</div>
            <div v-else-if="${key === 'borderRadius'}" class="w-56 h-56 border-1 bg-gray-300" style="border-radius: ${token.value}"></div>
            <div v-else-if="${key === 'borderWidth'}" class="w-56 h-56 border-1 border-pink-500 bg-gray-100" style="border-width: ${token.value}"></div>
        </div>
    </div>
    `
type BoxShadowObjType = {
    color: string,
    type: string,
    x: number,
    y: number,
    blur: number,
    spread: number
}

const convertObjectToBoxShadow = (value: BoxShadowObjType | BoxShadowObjType[]) => {
    let values = ''
    if(Array.isArray(value)) {
        values = value.map((v: BoxShadowObjType) => `${v.x}px ${v.y}px ${v.blur}px ${v.spread}px ${v.color}`).join(',')
    } else {
        values = `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`
    }

    console.log(value, values)
    return values + ";";
}
const groups : any = tokens.reduce((acc : any, token) => {
    const key = token.type
    if(token.name.includes('avatar') 
        || token.name.includes('button')
        || token.name.includes('nav-link')
        || token.name.includes('breadcrumbs'))
        return acc;

    if (!acc[key]) {
        acc[key] = []
    }

    if(acc[key].includes(token))
        return acc;

    acc[key].push(token)
    return acc
})

// remove all keys that are not arrays
Object.keys(groups).forEach(key => {
    if (!Array.isArray(groups[key]) || key === 'path') {
        delete groups[key]
    }
})

const Token: StoryObj = {
    render: () => ({
        template: `
            <div class="grid grid-cols-1 gap-4 p-20">
                ${Object.keys(groups).sort((a,b) => a.localeCompare(b)).map(key => `
                    <div class="border flex flex-col mb-20">
                        <div class="p-4 text-2xl capitalize font-medium border-b-1 mb-10">${key}</div>
                        <div class="flex flex-1 flex-col items-center justify-between p-4 gap-10">
                            ${groups[key].map((token : {value:string, name:string}) => template(token, key)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }),
    args: {},
}

export { Token }

export default meta
