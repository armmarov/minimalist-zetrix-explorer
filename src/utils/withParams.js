import {useParams} from 'react-router-dom';

export const withParams = WrappedComponent => props => {
  const params = useParams();
  return (<WrappedComponent {...props} params={params}/>);
};
