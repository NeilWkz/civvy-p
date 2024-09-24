import axios from 'axios'
import axiosRetry from 'axios-retry'
axiosRetry(axios, { retries: 3 })

/*
 * Aritable via Fetch/Axios
 */
export const airtableFetch = ({apiKey, baseID}) => axios.create({
  baseURL: `https://api.airtable.com/v0/${baseID}/`,
  timeout: 3000,
  headers: { Authorization: `Bearer ${apiKey}` },
})