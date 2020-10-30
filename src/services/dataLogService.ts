import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

const urlpre:string = "/kb/kg/kg-data-log";

const listfun:string = "/list";
const getfun:string = "/get";
const addfun :string= "/add";
const modifyfun:string = "/modify";
const delfun:string = "/del";
const saveListfun:string = "/saveList";




export async function query(params?: TableListItem) {
 // console.log(JSON.stringify(params));
    
  return request(urlpre + listfun, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    
    requestType: 'form',
    data: {
      ...params,
    },
  });
}


export async function get(id: string) {
  return request(urlpre + getfun + "/" + id, {
    method: 'GET',
  
  });
}
