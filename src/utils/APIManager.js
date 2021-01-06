
class APIManager {
    static MAIN_URL = 'http://api.etherscan.io/api?';
    static API_KEY = '4W91N2SY72HVH317NJPTW8E65EAAA2TRUC';

    static getAllTnxByAddress (address) {
      return `${APIManager.MAIN_URL}/module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&sort=ascapikey=${APIManager.API_KEY}`
    }
  }

  export default APIManager;
  
  