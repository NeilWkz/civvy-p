import { useCallback } from 'react' 
import axios from 'axios'
import axiosRetry from 'axios-retry'
import Airtable from 'airtable'
import { useState, useEffect } from 'react'

axiosRetry(axios, { retries: 3 })

const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID

/*
 * Aritable via Fetch/Axios
 */

export const airtableFetch = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}/`,
  timeout: 3000,
  headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
})




export const useAirtable = () => {
  const [records, setRecords] = useState([])
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

  const getRecords = useCallback(() => {
    base(AIRTABLE_TABLE_ID)
      .select({
        view: 'Grid view'
      })
      .eachPage(
        function page(fetchedRecords, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          setRecords([...records, ...fetchedRecords])
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error(err)
          }
        }
      )
  }, [base, records])

  useEffect(() => {
    getRecords()
  }, [getRecords])

  const createRecord = (fields) =>
    new Promise((resolve, reject) => {
      base(tableName).create(fields, (err, record) => {
        if (err) {
          reject(err)
          return
        }

        // on successful request -> update records state
        setRecords([...records, record])
        resolve(record)
      })
    })

  const updateRecord = (recordId, fields) =>
    new Promise((resolve, reject) => {
      base('Tasks').update(
        [
          {
            id: recordId,
            fields
          }
        ],
        function (err, updatedRecords) {
          if (err) {
            reject(err)
            return
          }
          updatedRecords.forEach((updatedRecord) => {
            // on successful request -> update records state
            setRecords(
              records.map((record) =>
                record.id === recordId ? updatedRecord : record
              )
            )
            resolve(updatedRecord)
          })
        }
      )
    })

  const deleteRecord = (recordId) =>
    new Promise((resolve, reject) => {
      base('Tasks').destroy(recordId, (err, deletedRecord) => {
        if (err) {
          reject(err)
          return
        }

        // on successful request -> update records state
        setRecords(records.filter((record) => record.id !== recordId))
        resolve()
      })
    })

  return [records, createRecord, updateRecord, deleteRecord]
}