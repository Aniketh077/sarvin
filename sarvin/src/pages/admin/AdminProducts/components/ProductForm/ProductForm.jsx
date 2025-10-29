import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Upload } from 'lucide-react';
import { uploadSingleImage } from '../../../../../store/slices/uploadSlice';
import FormField from './components/FormField';
import ImageManager from './components/ImageManager';
import FeatureManager from './components/FeatureManager';
import SpecificationManager from './components/SpecificationManager';
import {
  createNewType,
  updateExistingType,
  deleteType
} from '../../../../../store/slices/productSlice';

const ProductForm = ({ onClose, onSave, product, types }) => {
  const dispatch = useDispatch();
  const { uploading } = useSelector((state) => state.upload);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price !== undefined ? product.price : '',
    discountPrice: product?.discountPrice || null,
    productCollection: product?.productCollection || 'Small Appliances',
    warranty: product?.warranty || '',
    burners: product?.burners || '',
    ignitionType: product?.ignitionType || '',
    typeId: product?.type?._id || '',
    image: product?.image || '',
    images: product?.images || [],
    features: product?.features || [''],
    specifications: product?.specifications || {},
    stock: product?.stock !== undefined ? product.stock : '',
    featured: product?.featured || false,
    newArrival: product?.newArrival || false,
    bestSeller: product?.bestSeller || false,
  });

  const [errors, setErrors] = useState({});
  const [showNewType, setShowNewType] = useState(false);
  const [showManageTypes, setShowManageTypes] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    name: '',
    logo: ''
  });
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    if (formData.discountPrice && formData.price) {
      if (parseFloat(formData.discountPrice) > parseFloat(formData.price)) {
        setErrors({
          ...errors,
          discountPrice: 'Discount price must be less than regular price'
        });
      } else {
        const newErrors = { ...errors };
        delete newErrors.discountPrice;
        setErrors(newErrors);
      }
    }
  }, [formData.discountPrice, formData.price]);

  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await dispatch(uploadSingleImage({ 
        file, 
        folder: 'products',
        key: 'mainImage'
      })).unwrap();
      setFormData({ ...formData, image: result.url });
    } catch (error) {
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleNewTypeLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await dispatch(uploadSingleImage({ 
        file, 
        folder: 'types',
        key: 'typeLogo'
      })).unwrap();
      setNewTypeData({ ...newTypeData, logo: result.url });
    } catch (error) {
      alert('Failed to upload logo. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }
    if (name === 'typeId') {
      if (value === 'new') {
        setShowNewType(true);
        setFormData({ ...formData, typeId: 'new' });
      } else if (value === 'manage') {
        setShowManageTypes(true);
      } else {
        setShowNewType(false);
        setFormData({ ...formData, typeId: value });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleNewTypeChange = (e) => {
    const { name, value } = e.target;
    setNewTypeData({ ...newTypeData, [name]: value });
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setNewTypeData({ name: type.name, logo: type.logo || '' });
    setShowNewType(true);
  };

  const handleSaveType = () => {
    if (editingType) {
      dispatch(updateExistingType({ id: editingType.id, typeData: newTypeData }));
    } else {
      dispatch(createNewType(newTypeData));
    }
    resetTypeState();
  };

  const handleDeleteType = (id) => {
    if (window.confirm('Are you sure you want to delete this type?')) {
      dispatch(deleteType(id));
    }
  };

  useEffect(() => {
    if (formData.productCollection !== 'Cooking Appliances') {
      setFormData(prev => ({ ...prev, burners: '', ignitionType: '' }));
    }
  }, [formData.productCollection]);

  const resetTypeState = () => {
    setShowNewType(false);
    setEditingType(null);
    setNewTypeData({ name: '', logo: '' });
  };


const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.discountPrice && formData.price &&
        parseFloat(formData.discountPrice) > parseFloat(formData.price)) {
      setErrors({ ...errors, discountPrice: 'Discount price must be less than or equal to regular price' });
      return;
    }
    if (!formData.image || !validateImageUrl(formData.image)) {
      setErrors({ ...errors, image: 'Valid main image URL is required' });
      return;
    }

    const cleanData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      images: formData.images.filter(img => img.trim()),
    };

    if (showNewType && newTypeData.name.trim()) {
      cleanData.newType = newTypeData; // Send newType data
      delete cleanData.typeId;       // Don't send typeId if creating new
      delete cleanData.type;         // Remove original type field if it exists
    } else if (formData.typeId && formData.typeId !== 'new' && formData.typeId !== 'manage') {
      cleanData.type = formData.typeId; // Send existing typeId as 'type'
      delete cleanData.typeId;       // Remove the temporary typeId field
      delete cleanData.newType;      // Remove newType if it exists
    } else {
       delete cleanData.type;
       delete cleanData.typeId;
       delete cleanData.newType;
    }

    if (cleanData.productCollection === 'Cooking Appliances') {
      const burnerVal = parseInt(cleanData.burners, 10);
      cleanData.burners = !isNaN(burnerVal) ? burnerVal : null; 
      cleanData.ignitionType = cleanData.ignitionType === '' ? null : cleanData.ignitionType; 
    } else {
      cleanData.burners = undefined;
      cleanData.ignitionType = undefined;
    }

    cleanData.price = Number(cleanData.price);
    cleanData.stock = Number(cleanData.stock);
    if (cleanData.discountPrice) {
       cleanData.discountPrice = Number(cleanData.discountPrice);
       if (isNaN(cleanData.discountPrice) || cleanData.discountPrice <= 0) {
           cleanData.discountPrice = undefined; 
       }
    } else {
       cleanData.discountPrice = undefined; 
    }
    if (isNaN(cleanData.price)) cleanData.price = 0;
    if (isNaN(cleanData.stock)) cleanData.stock = 0; 

    const fieldsToRemove = [
       'typeId', 
       'id', '_id', '__v', 'createdAt', 
       'specificationsInput' 
    ];
    fieldsToRemove.forEach(field => delete cleanData[field]);

    // console.log("Payload being sent:", cleanData);
    onSave(cleanData);
};
  
  const typeOptions = [
    { value: '', label: 'Select Type' },
    ...types.map(type => ({ value: type.id, label: type.name })),
    { value: 'new', label: '+ Add New Type' },
    { value: 'manage', label: '📝 Manage Types' }
  ];

  const collectionOptions = [
    { value: 'Small Appliances', label: 'Small Appliances' },
    { value: 'Cooking Appliances', label: 'Cooking Appliances' }
  ];
  
  const burnerOptions = [
    { value: '', label: 'Select Burners' },
    { value: 1, label: '1 Burner' },
    { value: 2, label: '2 Burners' },
    { value: 3, label: '3 Burners' },
    { value: 4, label: '4 Burners' },
  ];

  const ignitionOptions = [
    { value: '', label: 'Select Ignition Type' },
    { value: 'Auto Ignition', label: 'Auto Ignition' },
    { value: 'Manual Ignition', label: 'Manual Ignition' }
  ];

  const mainImageUploading = uploading['mainImage'] || false;
  const typeLogoUploading = uploading['typeLogo'] || false;
  const isUploading = Object.values(uploading).some(Boolean);

  const validateImageUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <style>{`.product-form-scrollbar::-webkit-scrollbar{width:6px;}.product-form-scrollbar::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}.product-form-scrollbar{scrollbar-width:thin;scrollbar-color:#cbd5e1 #f7fafc;}`}</style>
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-10 sm:pb-20">
        <div className="inline-block w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-5xl my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white  sm:l">
          <form onSubmit={handleSubmit}>
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[#2A4365] to-[#1A365D]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-white">{product ? 'Edit Product' : 'Add New Product'}</h3>
                <button type="button" onClick={onClose} className="p-2 text-white hover:bg-white hover:bg-opacity-20  transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="px-2 sm:px-8 py-4 sm:py-6 max-h-[70vh] overflow-y-auto product-form-scrollbar text-xs sm:text-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <FormField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                <FormField label="Product Collection" name="productCollection" value={formData.productCollection} onChange={handleChange} type="select" options={collectionOptions} required />
              </div>

              {formData.productCollection === 'Cooking Appliances' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 p-4 bg-gray-50  border mb-6">
                      <FormField label="Number of Burners" name="burners" value={formData.burners} onChange={handleChange} type="select" options={burnerOptions}  />
                      <FormField label="Ignition Type" name="ignitionType" value={formData.ignitionType} onChange={handleChange} type="select" options={ignitionOptions} />
                  </div>
              )}

              <FormField label="Description" name="description" value={formData.description} onChange={handleChange} type="textarea" rows={3} className="text-xs sm:text-sm mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <FormField label="Regular Price" name="price" value={formData.price} onChange={handleChange} type="number" min="0" step="0.01" required className="text-xs sm:text-sm" />
                <div>
                  <FormField label="Discount Price" name="discountPrice" value={formData.discountPrice || ''} onChange={handleChange} type="number" min="0" step="0.01" className="text-xs sm:text-sm" />
                  {errors.discountPrice && (<p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>)}
                </div>
                <FormField label="Stock" name="stock" value={formData.stock} onChange={handleChange} type="number" min="0" required className="text-xs sm:text-sm" />
                <FormField label="Warranty" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="e.g., 2 Year" required />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <FormField label="Type" name="typeId" value={formData.typeId} onChange={handleChange} type="select" options={typeOptions} required className="text-xs sm:text-sm" />
                  {showManageTypes && (
                    <div className="mt-2 sm:mt-4 p-3 sm:p-6 bg-white  border border-[#E2E8F0] shadow-lg">
                      <div className="flex justify-between items-center mb-2 sm:mb-4">
                        <h4 className="text-base sm:text-lg font-semibold text-[#2A4365]">Manage Types</h4>
                        <button type="button" onClick={() => setShowManageTypes(false)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
                      </div>
                      <div className="max-h-40 sm:max-h-60 overflow-y-auto product-form-scrollbar">
                        {types.map(type => (
                          <div key={type.id} className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                            <span className="text-[#2A4365] text-xs sm:text-sm">{type.name}</span>
                            <div className="flex space-x-2">
                              <button type="button" onClick={() => { handleEditType(type); setShowManageTypes(false); }} className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">Edit</button>
                              <button type="button" onClick={() => handleDeleteType(type.id)} className="text-red-600 hover:text-red-800 text-xs sm:text-sm">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 sm:mt-4">
                        <button type="button" onClick={() => { setEditingType(null); setShowNewType(true); setShowManageTypes(false); }} className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#2A4365] to-[#1A365D] text-white  hover:from-[#1A365D] hover:to-[#2A4365] transition-all duration-200 text-xs sm:text-sm">Add New Type</button>
                      </div>
                    </div>
                  )}
                  {showNewType && (
                    <div className="mt-2 sm:mt-4 p-3 sm:p-6 bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7]  border border-[#E2E8F0]">
                      <div className="flex justify-between items-center mb-2 sm:mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#2A4365] flex items-center"><span className="w-2 h-2 bg-[#C87941]  mr-2"></span>{editingType ? 'Edit Type' : 'Create New Type'}</h4>
                        <button type="button" onClick={resetTypeState} className="text-xs text-red-600 hover:underline">Cancel</button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:gap-4">
                        <FormField label="Type Name" name="name" value={newTypeData.name} onChange={handleNewTypeChange} required className="text-xs sm:text-sm" />
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-[#2A4365] mb-1 sm:mb-2">Type Logo URL <span className="text-[#C87941] text-xs">optional</span></label>
                          <input type="url" name="logo" value={newTypeData.logo} onChange={handleNewTypeChange} className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-[#E2E8F0]  focus:outline-none focus:ring-2 focus:ring-[#2A4365] focus:border-[#2A4365] transition-all duration-200 text-[#2A4365] placeholder-gray-400 mb-2 sm:mb-3 text-xs sm:text-sm" placeholder="https://example.com/logo.jpg" />
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <label className={`flex items-center px-2 sm:px-4 py-2 bg-[#2A4365] text-white  transition-all duration-200 text-xs sm:text-sm cursor-pointer ${typeLogoUploading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#1A365D]'}`} disabled={typeLogoUploading}><input type="file" accept="image/*" onChange={handleNewTypeLogoUpload} disabled={typeLogoUploading} className="hidden" />{typeLogoUploading ? (<><svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Or Upload Type Logo</>)}</label>
                            {newTypeData.logo && (<span className="text-xs text-green-600 font-medium">✓ Logo added</span>)}
                          </div>
                          {newTypeData.logo && (<div className="w-14 h-14 sm:w-20 sm:h-20  overflow-hidden border-2 border-[#E2E8F0] shadow-sm"><img src={newTypeData.logo} alt="Type logo preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /><div className="hidden w-full h-full bg-gray-100 items-center justify-center text-xs text-gray-500">Invalid Image</div></div>)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-2 sm:mt-4">
                        {editingType && (<button type="button" onClick={() => handleDeleteType(editingType.id)} className="px-4 py-2 bg-red-600 text-white  hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm">Delete Type</button>)}
                        <button type="button" onClick={handleSaveType} className="px-4 py-2 bg-gradient-to-r from-[#2A4365] to-[#1A365D] text-white  hover:from-[#1A365D] hover:to-[#2A4365] transition-all duration-200 text-xs sm:text-sm">{editingType ? 'Update Type' : 'Create Type'}</button>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#2A4365] mb-1 sm:mb-2">Main Image <span className="text-[#C87941]">*</span></label>
                  <input type="url" name="image" value={formData.image} onChange={handleChange} className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-[#E2E8F0]  focus:outline-none focus:ring-2 focus:ring-[#2A4365] focus:border-[#2A4365] transition-all duration-200 text-[#2A4365] placeholder-gray-400 mb-2 sm:mb-3 text-xs sm:text-sm" placeholder="https://example.com/image.jpg" required />
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className={`flex items-center px-2 sm:px-4 py-2 bg-[#2A4365] text-white  transition-all duration-200 text-xs sm:text-sm cursor-pointer ${mainImageUploading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#1A365D]'}`} disabled={mainImageUploading}><input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={mainImageUploading} className="hidden" />{mainImageUploading ? (<><svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Uploading...</>) : (<><Upload className="h-4 w-4 mr-2" />Or Upload Main Image</>)}</label>
                    {formData.image && (<span className="text-xs text-green-600 font-medium">✓ Image added</span>)}
                  </div>
                  {formData.image && (<div className="w-20 h-20 sm:w-32 sm:h-32  overflow-hidden border-2 border-[#E2E8F0] shadow-sm"><img src={formData.image} alt="Main product preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /><div className="hidden w-full h-full bg-gray-100 items-center justify-center text-xs text-gray-500">Invalid Image</div></div>)}
                </div>
              </div>
              <ImageManager images={formData.images} onChange={(images) => setFormData({ ...formData, images })} />
              <FeatureManager features={formData.features} onChange={(features) => setFormData({ ...formData, features })} />
              <SpecificationManager specifications={formData.specifications} onChange={(specifications) => setFormData({ ...formData, specifications })} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center p-2 sm:p-4 bg-gradient-to-r from-[#F7FAFC] to-[#EDF2F7]  border border-[#E2E8F0]"><input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 sm:h-5 sm:w-5 text-[#2A4365] focus:ring-[#2A4365] border-[#C87941] " /><label htmlFor="featured" className="ml-2 sm:ml-3 block text-xs sm:text-sm font-medium text-[#2A4365]">Featured Product</label></div>
                <div className="flex items-center p-2 sm:p-4 bg-gradient-to-r from-[#F7FAFC] to-[#EDF2F7]  border border-[#E2E8F0]"><input type="checkbox" id="newArrival" name="newArrival" checked={formData.newArrival} onChange={handleChange} className="h-4 w-4 sm:h-5 sm:w-5 text-[#2A4365] focus:ring-[#2A4365] border-[#C87941] " /><label htmlFor="newArrival" className="ml-2 sm:ml-3 block text-xs sm:text-sm font-medium text-[#2A4365]">New Arrival</label></div>
                <div className="flex items-center p-2 sm:p-4 bg-gradient-to-r from-[#F7FAFC] to-[#EDF2F7]  border border-[#E2E8F0]"><input type="checkbox" id="bestSeller" name="bestSeller" checked={formData.bestSeller} onChange={handleChange} className="h-4 w-4 sm:h-5 sm:w-5 text-[#2A4365] focus:ring-[#2A4365] border-[#C87941] " /><label htmlFor="bestSeller" className="ml-2 sm:ml-3 block text-xs sm:text-sm font-medium text-[#2A4365]">Best Seller</label></div>
              </div>
            </div>
            <div className="px-2 sm:px-8 py-4 sm:py-6 border-t border-[#E2E8F0] bg-gradient-to-r from-[#F7FAFC] to-[#EDF2F7] flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 border border-[#C87941] text-[#C87941]  hover:bg-[#C87941] hover:text-white transition-all duration-200 font-medium text-xs sm:text-sm">Cancel</button>
              <button type="submit" disabled={isUploading || Object.keys(errors).length > 0} className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#2A4365] to-[#1A365D] text-white  hover:from-[#1A365D] hover:to-[#2A4365] transition-all duration-200 font-medium shadow-lg disabled:opacity-50 text-xs sm:text-sm">{isUploading ? 'Processing...' : (product ? 'Update Product' : 'Add Product')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;