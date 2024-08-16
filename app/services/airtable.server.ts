import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3 })

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID

/*
 * Aritable via Fetch/Axios
 */

export const airtableFetch = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/`,
  timeout: 3000,
  headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
})