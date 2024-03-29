import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    email: '',
    transaction_id: '',
    transaction_date: '',
    number_of_beneficiary: '',
  });

  const [tableData, setTableData] = useState([]);
  const [referenceId, setReferenceId] = useState('');

  const handleInputChange = (e, field) => {
    const inputValue = e.target.value;

    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      setFormData({
        ...formData,
        [field]: inputValue,
      });
      return;
    }

    // Validate if it's the 'mobile' field and the input is a valid number with a length of 10 or fewer characters
    if (field === 'mobile' && (!/^\d+$/.test(inputValue) || inputValue.length > 10)) {
      return; // Do not update state
    }
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    if (field === 'number_of_beneficiary') {
      setTableData([
        { number_of_beneficiary: e.target.value, name: '', mobile: '', address: '', product: '' },
      ])
    }
  };

  const handleTableCellChange = (e, rowIndex, fieldName) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][fieldName] = e.target.value;
    setTableData(updatedTableData);
  };

  const handleAddMore = () => {
    setTableData((prevTableData) => [...prevTableData, { number_of_beneficiary: formData.number_of_beneficiary, name: '', mobile: '', address: '', product: '' }]);
  };

  const handleRemove = () => {
    const newArray = [...tableData.slice(0, -1)];
    setTableData(newArray);
  };

  const handleSubmit = async () => {
    // Make API call with formData and tableData
    console.log('Form Data:', formData);
    console.log('Table Data:', tableData);
    try {
      const response = await fetch('https://sign2024.happykidz.co.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, tableData }),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log('response.ok =======', responseData)

        // Handle success, maybe show a success message
        console.log('Data submitted successfully!');
        setReferenceId(responseData.reference_id)

      } else {
        // Handle error, maybe show an error message
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error occurred during submission', error);
    }

    // Add your API call logic here
  };
  return (
    <>
      <div className="App">
        {referenceId ?
          <div>
            <h2>SOCIAL ENTREPRENEURSHIP DEVELOPMENT PROGRAM 2024</h2>
            Thank you for the details. Your reference ID is {referenceId}
          </div> :
          <>
            <span>
              <h2>SOCIAL ENTREPRENEURSHIP DEVELOPMENT PROGRAM 2024</h2>
            </span>
            <div>
              <form>
                <label>
                  Full Name:
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => handleInputChange(e, 'fullname')}
                  />
                </label>
                <br />
                <label>
                  Mobile:
                  <input
                    type="number"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange(e, 'mobile')}
                  />
                </label>
                <br />
                <label>
                  Transaction Id:
                  <input
                    type="text"
                    value={formData.transaction_id}
                    onChange={(e) => handleInputChange(e, 'transaction_id')}
                  />
                </label>
                <br />
                <label>
                  Transaction Date:
                  <input
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) => handleInputChange(e, 'transaction_date')}
                  />
                </label>


                <br />
                <label>
                  Email:
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                  />
                </label>
                <br />
                <label>
                  Number of Beneficiary:
                  <input
                    type="number"
                    value={formData.number_of_beneficiary}
                    onChange={(e) => handleInputChange(e, 'number_of_beneficiary')}
                  />
                </label>
              </form>
            </div>
            {/* {(formData.number_of_beneficiary && (JSON.parse(formData.number_of_beneficiary) > 0)) ?
              <div>
                <h2>Table</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Beneficiary Name</th>
                      <th>Beneficiary Mobile</th>
                      <th>Beneficiary Address</th>
                      <th>Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) =>
                              handleTableCellChange(e, rowIndex, 'name')
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.mobile}
                            onChange={(e) =>
                              handleTableCellChange(e, rowIndex, 'mobile')
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.address}
                            onChange={(e) =>
                              handleTableCellChange(e, rowIndex, 'address')
                            }
                          />
                        </td>
                        <td>
                          <select id="dropdown" value={row.product} onChange={(e) =>
                            handleTableCellChange(e, rowIndex, 'product')
                          }
                          >
                            <option value="">Select...</option>
                            <option value="Laptop Rs.40000">Laptop Rs.40000</option>
                            <option value="Usha Machin Motor Rs.2000">Usha Machin Motor Rs.2000</option>
                            <option value="Usha Delux Rs.7400">Usha Delux Rs.7400</option>
                            <option value="Usha RSM Pro Rs.11000">Usha RSM Pro Rs.11000</option>
                            <option value="Usha Janome Rs.14500">Usha Janome Rs.14500</option>
                            <option value="Usha Power Rs.26000">Usha Power Rs.26000</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button disabled={(tableData.length == formData.number_of_beneficiary) || (!tableData[tableData.length - 1].name) || (!tableData[tableData.length - 1].product)} onClick={handleAddMore}>Add more</button>
                <button disabled={(tableData.length < 2)} onClick={handleRemove}>Remove</button>
              </div>
              : null}
            <button disabled={(
              !formData.fullname ||
              !formData.mobile ||
              !formData.transaction_id ||
              !formData.transaction_date ||
              !formData.number_of_beneficiary
            )} onClick={handleSubmit}>Submit</button> */}
          </>
        }
      </div>

      {(formData.number_of_beneficiary && (JSON.parse(formData.number_of_beneficiary) > 0) && !referenceId) ?
        <div>
          <h2 style={{ textAlign: 'center' }}>Table</h2>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <tr>
                <th>Beneficiary Name</th>
                <th>Beneficiary Mobile</th>
                <th>Beneficiary Address</th>
                <th>Product</th>
              </tr>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) =>
                        handleTableCellChange(e, rowIndex, 'name')
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.mobile}
                      onChange={(e) =>
                        handleTableCellChange(e, rowIndex, 'mobile')
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.address}
                      onChange={(e) =>
                        handleTableCellChange(e, rowIndex, 'address')
                      }
                    />
                  </td>
                  <td>
                    <select id="dropdown" value={row.product} onChange={(e) =>
                      handleTableCellChange(e, rowIndex, 'product')
                    }
                    >
                      <option value="">Select...</option>
                      <option value="Laptop Rs.40000">Laptop Rs.40000</option>
                      <option value="Usha Machin Motor Rs.2000">Usha Machin Motor Rs.2000</option>
                      <option value="Usha Delux Rs.7400">Usha Delux Rs.7400</option>
                      <option value="Usha RSM Pro Rs.11000">Usha RSM Pro Rs.11000</option>
                      <option value="Usha Janome Rs.14500">Usha Janome Rs.14500</option>
                      <option value="Usha Power Rs.26000">Usha Power Rs.26000</option>
                    </select>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        : null}

      <div style={{ textAlign: 'center' }}>
        {(formData.number_of_beneficiary && (JSON.parse(formData.number_of_beneficiary) > 0) && !referenceId) ?
          <>
            <button disabled={(tableData.length == formData.number_of_beneficiary) || (!tableData[tableData.length - 1].name) || (!tableData[tableData.length - 1].product)} onClick={handleAddMore}>Add more</button>
            <button disabled={(tableData.length < 2)} onClick={handleRemove}>Remove</button>
          </>
          : null}
        {!referenceId ?
          <button disabled={(
            !formData.fullname ||
            !formData.mobile ||
            !formData.transaction_id ||
            !formData.transaction_date ||
            !formData.number_of_beneficiary
          )} onClick={handleSubmit}>Submit</button>
          : null}
      </div>

    </>
  );
}

export default App;
