'use client'
import React, { MouseEvent, useEffect, useState } from "react";
import { collection, addDoc, updateDoc, getDocs, QuerySnapshot, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import toast from "react-hot-toast";


export default function Home() {
  const [items, setitems] = useState<any[]>([])

  const [total, settotal] = useState(0)

  const [newitem, setnewitem] = useState({ name: "", price: "" })

  ///ADD ITEM
  const addItem = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (newitem.name.trim() === "" || newitem.price.trim() === "") {
      return toast.error("Please enter valid data")
    } else if (Boolean(Number(newitem.name))) {
      return toast.error("Enter valid name")
    }
    try {
      setitems([...items, newitem])
      await addDoc(collection(db, "items"), {
        name: newitem.name.trim(),
        price: newitem.price
      })
      toast.success("Added New Item")
      setnewitem({ name: "", price: "" })
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  ///GET ITEM
  useEffect(() => {
    const q = query(collection(db, 'items'))
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr: { id: string; }[] = []
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id })
      })
      setitems(itemsArr)

      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce((sum, item: any) => sum + parseFloat(item.price), 0)
        settotal(totalPrice)
      }
      calculateTotal()
      return () => unsubscribe()
    })
  }, [])


  ///DELETE ITEM

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'items', id))
    toast.success("Successfully deleted")
  }


  ///EDIT ITEM

  const [editingID, seteditingID] = useState("")

  const [editItem, seteditItem] = useState({ name: "", price: "" })

  const editOne = async (id: string) => {
    const item = items.find((data) => data.id === id)
    if (item) {
      seteditingID(id)
      seteditItem({
        name: item.name,
        price: item.price
      })
    }
  }

  const update = async () => {
    if (editItem.name.trim() === "" || editItem.price.trim() === "" || Number(editItem.price) <= 0) {
      return toast.error("Please enter valid data")
    } else if (Boolean(Number(editItem.name))) {
      return toast.error("Enter valid name")
    }
    try {
      await updateDoc(doc(db, "items", editingID), {
        name: editItem.name,
        price: editItem.price
      })
      toast.success("Updated Successfully")
      seteditingID("")
    } catch (error) {
      toast.error((error as Error).message)
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-4 sm:p-24">
      <h1 className="text-5xl font-bold drop-shadow-lg p-4 text-center text-white">Expense Tracker</h1>
      <div className="z-10 drop-shadow-xl max-w-lg w-full items-center justify-between font-mono text-sm">
        <div className="bg-slate-800 p-6 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newitem.name}
              onChange={(e) => setnewitem({ ...newitem, name: e.target.value })}
              className="outline-none rounded-lg col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item" />
            <input
              value={newitem.price}
              onChange={(e) => setnewitem({ ...newitem, price: e.target.value })}
              className="outline-none rounded-lg col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter amount" />
            <button
              onClick={(e) => addItem(e)}
              className="rounded-lg text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit">
              +
            </button>
          </form>
          {items.length === 0 && (
            <>
              <div className="shadow rounded-md p-4 w-full mx-auto">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-700 rounded" />
                      <div className="h-2 bg-slate-700 rounded" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-700 rounded" />
                      <div className="h-2 bg-slate-700 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <ul>
            {items.map((item: any, id: any) => (
              <li key={id} className="hover:scale-[1.01] hover:text-slate-900 text-white hover:bg-indigo-100  transition-transform duration-300 ease-in-out my-4 w-full rounded-lg flex justify-between bg-slate-950">
                <div className="py-4 md:p-3 w-full flex md:justify-between justify-center ">
                  {editingID === item.id ? (
                    <>
                      <input
                        value={editItem.name}
                        onChange={(e) => seteditItem({ ...editItem, name: e.target.value })}
                        className="md:w-36 rounded-lg outline-none text-black w-20 p-3 border"
                        type="text"
                        placeholder="Enter Item" />
                      <input
                        value={editItem.price}
                        onChange={(e) => seteditItem({ ...editItem, price: e.target.value })}
                        className="md:w-36 rounded-lg outline-none text-black w-20 pl-3 border mx-3"
                        type="number"
                        placeholder="Enter amount" />
                    </>
                  ) : (
                    <>
                      <span className="capitalize ">{item.name}</span>
                      <span className="">₹{item.price}</span>
                    </>
                  )}

                </div>
                {editingID === item.id ? (
                  <>
                    <button
                      onClick={(e) => seteditingID("")}
                      className=" p-3 border-l-2 hover:text-white border-slate-900 hover:bg-slate-900 w-16">
                      CANCEL
                    </button>
                    <button
                      onClick={(e) => update()}
                      className="p-4 border-l-2 hover:text-white border-slate-900 hover:bg-slate-900 w-16">
                      DONE
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => editOne(item.id)}
                      className="p-4 border-l-2 hover:text-white border-slate-900 hover:bg-slate-900 w-16">
                      EDIT
                    </button>
                    <button
                      onClick={(e) => deleteItem(item.id)}
                      className=" p-4 border-l-2 hover:text-white border-slate-900 hover:bg-slate-900 w-16">
                      X
                    </button>
                  </>
                )}

              </li>
            ))}
          </ul>
          {items.length < 1 ? ("") : (
            <div className="flex justify-between p-3 text-xl  text-white">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
