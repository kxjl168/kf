
import { history, Reducer, Effect } from 'umi';
import { stringify } from 'querystring';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { setToken } from '@/utils/token';
import _ from 'lodash';
import { setAuthority, setKey } from '@/utils/authority';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  username?:string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  id?:string;
  userid?: string;
  token?:string;
  tokenName?: string;
  roleId?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      // debugger;
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *logout({ payload }, { call, put }) {
      // yield call(fakeAccountLogout, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          status: false,
          data: "",
        },
      });
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      if (!action.payload)
        return {};
      //debugger;
      //console.log("user/saveuser" + JSON.stringify(action));
      let user={}

      if (action.payload.data === '') {
        setToken("");
        setAuthority("nologin");
        user={
          username:'访客',
          userid:'test',
        }
        setKey("app_key","");
        setKey("app_secret","");
  
      }
      else{
       // debugger;
         user=_.cloneDeep( action.payload.data);
        // if(!user.userid)
        // user.userid=user.id;

        if(user.userName)
        user.username=user.userName;

        if(user.name)
        user.username=user.name;


        if(user.userName==="访客")
        {
          setAuthority("nologin");
        }

      }

     

      return {
        ...state,
        currentUser: user || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
