
const serverUrl = 'http://dev.williamsamtaylor.co.uk:3003';

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
