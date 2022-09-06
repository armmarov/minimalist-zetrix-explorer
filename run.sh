REACT_APP_BASEURL='http://18.136.67.108:19333' PORT=3000 pm2 start npm --name relay -- start
REACT_APP_BASEURL='http://13.250.42.42:19333' PORT=3001 pm2 start npm --name testnet -- start
REACT_APP_BASEURL='http://13.250.42.42:18002' PORT=3002 pm2 start npm --name mainnet -- start
