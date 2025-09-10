import { rest } from '@fiscozen/data'
import type { Brewery } from './types'

export const useBreweries = () => {

    const { useActions } = rest

    const { useRetrieve, useAll } = useActions<Brewery>('breweries')

    return {
        useRetrieveBreweryById: useRetrieve,
        useAllBreweries: useAll,
    }
}