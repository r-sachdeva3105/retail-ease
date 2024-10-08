import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../dialogs/DeleteProductDialog";
import AddDialog from "../dialogs/AddProductDialog";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await fetch("http://localhost:8081/api-product/all-products")
          .then((response) => response.json())
          .then((data) => {
            setProducts(data);
            setFilteredProducts(data);
            setIsRendered(true);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const productList = products.filter((product) => {
      return product.productName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilteredProducts(productList);
  };

  const [deleteProductSKU, setDeleteProductSKU] = useState();
  const [deleteProductName, setDeleteProductName] = useState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteValid, setDeleteValid] = useState(true);

  const handleDelete = (sku, name) => {
    setDeleteProductSKU(sku);
    setDeleteProductName(name);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteValid(true);
  };

  const handleDeleteConfirm = async () => {
    const request = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "content-type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({
        productSKU: deleteProductSKU,
      }),
    };
    await fetch("http://localhost:8081/api-product/delete-product", request)
      .then((res) => {
        if (res?.ok) {
          setIsDeleteDialogOpen(false);
          setDeleteValid(true);
          window.location.reload();
        } else {
          setDeleteValid(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setDeleteValid(false);
      });
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addProductSKU, setAddProductSKU] = useState();
  const [addProductName, setAddProductName] = useState();
  const [addProductExpirable, setAddProductExpirable] = useState();

  const [quantValid, setQuantValid] = useState();
  const [expValid, setExpValid] = useState();

  const handleAdd = (sku, name, isExpirable) => {
    setAddProductSKU(sku);
    setAddProductName(name);
    setAddProductExpirable(isExpirable);
    setIsAddDialogOpen(true);
  };

  const handleAddConfirm = async (e) => {
    console.log(e);
    e.preventDefault();
    if (parseInt(e.target.form[0].value < 1)) {
      setQuantValid(false);
    }
    if (addProductExpirable && e.target.form[1].value === "") {
      setExpValid(false);
    }
    if (
      (quantValid && addProductExpirable && expValid) ||
      (quantValid && !addProductExpirable)
    ) {
      console.log(e.target.form[0].value);
      const request = {
        method: "POST",
        mode: "cors",
        headers: {
          "content-type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({
          productSKU: addProductSKU,
          warehouseID: 1,
          expiryDate: addProductExpirable
            ? e.target.form[1].value
              ? e.target.form[1].value
              : ""
            : "",
          quantity: e.target.form[0].value
            ? parseInt(e.target.form[0].value)
            : 0,
        }),
      };
      await fetch("http://localhost:8081/api-inventory/add-inventory", request)
        .then((res) => {
          if (res?.ok) {
            setIsAddDialogOpen(false);
            setQuantValid(true);
            setExpValid(true);
          } else {
            setQuantValid(false);
            setExpValid(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setQuantValid(true);
    setExpValid(true);
  };

  // const [editProductSKU, setEditProductSKU] = useState();

  // const handleEdit = (sku, name) => {
  //   setEditProductSKU(sku);
  // };

  // const handleEditConfirm = async (e) => {
  //   console.log(e);
  //   e.preventDefault();
  // };

  return (
    <div className="min-h-full">
      {/* HEADER */}

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl p-4 md:flex justify-between items-center">
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Products
          </h1>
          <div className="flex gap-3 justify-center pt-2 md:pt-0">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-50 md:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for items"
                onChange={handleChange}
              />
            </div>
            <button
              onClick={() => navigate("/add")}
              type="button"
              className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <svg
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl p-4">
        <div className="relative overflow-x-auto shadow rounded-md mt-4">
          <table className="w-full text-sm text-left rtl:text-right text-gray-600">
            <thead className="text-xs text-gray-900 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Product name
                </th>
                <th scope="col" className="px-4 py-3">
                  Category
                </th>
                <th scope="col" className="px-4 py-3">
                  Price
                </th>
                <th scope="col" className="px-4 py-3">
                  Storage
                </th>
                <th scope="col" className="px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {isRendered && (
              <tbody>
                {filteredProducts?.map((product) => (
                  <tr
                    key={product.productSKU}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap capitalize"
                    >
                      {product.productName}
                    </th>
                    <td className="px-4 py-4 capitalize">
                      {product.productCategoryName}
                    </td>
                    <td className="px-4 py-4">
                      ${product.productSellingPrice}
                    </td>
                    <td className="px-4 py-4 capitalize">
                      {product.storageType}
                    </td>
                    <td className="px-4 py-4 flex gap-3">
                      <p
                        onClick={() =>
                          handleAdd(
                            product.productSKU,
                            product.productName,
                            product.isExpirable
                          )
                        }
                        className="font-medium text-sky-600 hover:underline cursor-pointer"
                      >
                        Add
                      </p>
                      <p
                        onClick={() =>
                          navigate(`/edit?sku=${product.productSKU}`)
                        }
                        className="font-medium text-sky-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </p>
                      <p
                        onClick={() =>
                          handleDelete(product.productSKU, product.productName)
                        }
                        className="font-medium text-sky-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </main>

      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        closeDeleteDialog={closeDeleteDialog}
        deleteProductName={deleteProductName}
        deleteValid={deleteValid}
        handleDeleteConfirm={handleDeleteConfirm}
      />

      <AddDialog
        isAddDialogOpen={isAddDialogOpen}
        closeAddDialog={closeAddDialog}
        addProductName={addProductName}
        addProductExpirable={addProductExpirable}
        quantValid={quantValid}
        expValid={expValid}
        setQuantValid={setQuantValid}
        setExpValid={setExpValid}
        handleAddConfirm={handleAddConfirm}
      />
    </div>
  );
};

export default Products;
