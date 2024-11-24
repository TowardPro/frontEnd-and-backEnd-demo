import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
const Leftsidebar = () => {
  return (
    <div className='left-sidebar'>
    <h3>BABAR</h3>
    <div className='button-group'>
        <div className='btnn'><Link
                    to="/admin/"
                    style={{ textDecoration: "none" }}
                  ><button><span className="material-symbols-outlined">Dashboard</span>Dashboard</button></ Link></div>
        <div className='btnn'><Link
                    to="/customerOverview/"
                    style={{ textDecoration: "none" }}
                  ><button><span className="material-symbols-outlined">person</span>Customers</button></Link></div>
        <div className='btnn'><Link
                    to="/analysis/"
                    style={{ textDecoration: "none" }}
                  ><button><span className="material-symbols-outlined">monitoring</span>Analysis</button></Link></div>
      
        <div className='btnn'><Link
                    to="/productStorage/"
                    style={{ textDecoration: "none" }}
                  ><button><span className="material-symbols-outlined">category</span>Products</button></Link></div>
        
        <div className='btnn'><Link
                    to="/setting/"
                    style={{ textDecoration: "none" }}
                  ><button><span className="material-symbols-outlined">settings</span>Setting</button></Link></div>
        <div className='btnn'><Link
                    to="/productImport/"
                    style={{ textDecoration: "none" }}
                  ><button><span className="material-symbols-outlined">add</span>Add Products</button></Link></div>
        <div className='btnn'><button><span className="material-symbols-outlined">logout</span>logout</button></div>
        
        </div>
</div>
  )
}

export default Leftsidebar