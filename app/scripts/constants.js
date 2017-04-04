
const serverUrl = 'http://www.williamsamtaylor.co.uk:3001';
//const serverUrl = 'http://localhost:3001';

export const endpoint = url => {
  return `${serverUrl}/${url || ''}`;
}

export const customStyles = {
  content : {
    top: '10%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, 0%)',
    width: '600px'
  }
};
