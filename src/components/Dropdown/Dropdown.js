import React, {useState, useEffect} from 'react'
import './Dropdown.scss'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'



function Dropdown() {
  const [speakers, setSpeakers] = useState(null)
  const [categories, setCategories] = useState(null)
  const [subcategory, setSubcategory] = useState(null)
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null)
  
  // 
  const [categoriesId, setCategoriesId] = useState(null)
  const [subcategoryId, setSubcategoryId] = useState(null)
  const [results, setResults] = useState(null)


  useEffect(function(){
    axios.get('https://api.itorah.com/api/Speakers/allspeakers')
    .then(response => setSpeakers(response.data))
    .catch(error => console.log(error)); 
  }, [])

  // get categories and setting state for selected speaker ID

const onddlChange = (e) => {
  setSelectedSpeakerId(e.target.value)
  axios.get(`https://api.itorah.com/api/Categories/catfilter?SpeakerID=${e.target.value}`)
    .then(response => {setCategories(response.data)}
    )
    .catch(error => console.log(error));
}

const onthirdChange = (e) => {
  
  setCategoriesId(e.target.value)
  axios.get(`https://api.itorah.com/api/Categories/subfilter?CategoryID=${e.target.value}&SpeakerID=${selectedSpeakerId}`)
    .then(response => {setSubcategory(response.data) 
      
    })
    .catch(error => console.log(error));
}

// set the subCategoryId 
const onfourthChange = (e) => {
  
  setSubcategoryId(e.target.value)
}
  

function handleClick(e) {
e.preventDefault();
let url = ""

if(subcategoryId){url = `https://api.itorah.com/api/Shiurim/all?PageIndex=1&PageSize=20&CategoryID=+${subcategoryId}+&SpeakerID=${selectedSpeakerId}`}else {url = `https://api.itorah.com/api/Shiurim/all?PageIndex=1&PageSize=20&CategoryID=+${categoriesId}+&SpeakerID=${selectedSpeakerId}`}

axios.get(url)
.then(response => {
setResults(response.data.shiurList)
} 
)
.catch(error => console.log(error));
}


  return (
<div className="dropdown">
<Form.Select className="dropdown__form" aria-label="Default select example" onChange={onddlChange}>
  <option >All Speakers</option>
  {
    speakers
    ?.filter(speaker => speaker.isMainSpeaker === true)
    ?.map((speaker) => (
  <option key={speaker.id} value={speaker.id}  >{speaker.firstName} {speaker.lastName}</option>
    ))
  }
  <option></option>
  <option></option>
{
  speakers
  ?.filter(speaker => speaker.isMainSpeaker === false)
  ?.map((speaker) => (
    <option key={speaker.id}>{speaker.firstName} {speaker.lastName}</option>
  ))
  
}
</Form.Select>

 <Form.Select className="dropdown__form" aria-label="Default select example" onChange={onthirdChange} >
  <option>All Categories</option>
  {
    categories?.map((category) => (
      <option key={category.id} value={category.id}>{category.name} ({category.shiurCount})</option>
    ))
  }
    
</Form.Select>

<Form.Select className="dropdown__form" aria-label="Default select example" onChange={onfourthChange}>
  <option>All Subcategories</option>
  {
    subcategory?.map((subcategory) => (
      <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
    ))
  }
</Form.Select>


<Button className="dropdown__button" variant="primary" onClick={handleClick}>Search</Button>{' '}


<div>
{results?.map((result) => (
  <Table key={result.id} striped bordered hover>
  <thead>
    <tr>
      <th>Speaker Name</th>
      <th>Sponsor</th>
      <th>Lecture Title</th>
      <th>Audio/Video</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{result.speaker}</td>
      <td>{result.sponsor}</td>
      <td>{result.title}</td>
      <td>{result.video} {result.audio}</td>
    </tr>
  </tbody>
</Table>
))

}
</div>


</div>
  )


}

export default Dropdown;
