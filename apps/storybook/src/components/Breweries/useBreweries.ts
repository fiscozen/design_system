import { rest } from '@fiscozen/data'
import type { Brewery } from './types'

export const useBreweries = () => {

    const { useActions } = rest

    const { useRetrieve, useList } = useActions<Brewery>('breweries')

    return {
        useRetrieveBreweryById: useRetrieve,
        useListBreweries: useList,
    }
}