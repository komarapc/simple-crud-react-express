import { cn, numberFormat } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { Edit2, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import * as color from "tailwindcss/colors";
import { HiEllipsisVertical } from "react-icons/hi2";
type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  publishedDate: Date | string;
  totalSales: number;
  price: {
    amount: number;
    currency: string;
  };
};
type ModalType =
  | "create"
  | "update"
  | "delete"
  | "delete-all"
  | "view"
  | "none";
const showPerPage = ["10", "20", "30", "50"];
const api = "http://localhost:3000";
const fetchBooks = async () => {
  const response = await fetch(`${api}/books`);
  const data = await response.json();
  return data || [];
};

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [perPage, setPerPage] = useState<any>(new Set(["10"]));
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [modal, setModal] = useState<ModalType>("none");
  const { isOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book>({} as Book);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [serverOnline, setServerOnline] = useState(true);
  const filteredBooks = useMemo(() => {
    const limit =
      Number(Array.from(perPage)[0]) ||
      Number(getKeyValue(perPage, "currentKey")) ||
      10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const query = searchTitle.toLowerCase();

    const booksFiltered = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    const booksSliced = booksFiltered.slice(start, end);
    const totalData = booksFiltered.length;
    const totalPage = Math.ceil(totalData / limit);
    return { books: booksSliced, totalPage, totalData };
  }, [books, searchTitle, perPage, page]);

  const fetchDataBook = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks();
      setBooks(data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  setInterval(() => {
    isOnline();
  }, 5000);

  const countSelectedBooks = useMemo(
    () => selectedBooks.length,
    [selectedBooks]
  );

  const handleBulkDelete = async () => {
    const response = await fetch(`${api}/books/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedBooks),
    });
    const data = await response.json();
    if (!data) {
      toastError("Failed to delete books");
      return;
    }
    toastSuccess("Books deleted successfully");
    setSelectedKeys(new Set([]));
    setSelectedBooks([]);
    fetchDataBook();
    onOpenChange();
  };

  const isOnline = async () => {
    try {
      // fetch data from a url api
      const response = await fetch(api);
      if (response.ok) {
        setServerOnline(true);
      }
    } catch (error) {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDataBook();
      await isOnline();
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTitle]);

  useEffect(() => {
    if (selectedKeys === "all") {
      setSelectedBooks(books);
      return;
    }
    const keyEntries = Array.from(selectedKeys);
    const selected = books.filter((book) => keyEntries.includes(book.id));
    setSelectedBooks(selected);
  }, [selectedKeys]);

  return (
    <>
      <div className="container mx-auto py-10 font-inter">
        <Card className={cn("bg-card text-card-foreground")}>
          <CardHeader>
            <div>
              <h2 className="text-lg font-semibold">Simple CRUD books </h2>
              <p className="text-sm">
                This is a simple CRUD application with ReactJS and Express.
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table
              aria-label="books table"
              aria-labelledby="books table"
              removeWrapper
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              selectionMode="multiple"
              topContent={
                <div className="flex items-center justify-between w-full">
                  <div className="w-full flex items-center gap-4">
                    <Select
                      label="Show per page"
                      items={showPerPage.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      selectedKeys={perPage}
                      onSelectionChange={setPerPage}
                      className="w-full lg:w-32"
                    >
                      {(item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      )}
                    </Select>
                    <Input
                      label="Search title"
                      onChange={(e) => setSearchTitle(e.target.value)}
                      value={searchTitle}
                      className="w-full lg:w-64"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      variant="dot"
                      color={serverOnline ? "success" : "danger"}
                      size="lg"
                      classNames={{
                        dot: "w-3 h-3",
                      }}
                    >
                      {serverOnline ? "Server Online" : "Server Offline"}
                    </Chip>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          color="primary"
                          variant="flat"
                          startContent={<HiEllipsisVertical size={24} />}
                          isIconOnly
                        ></Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="dropdown"
                        aria-labelledby="dropdown"
                        disabledKeys={[
                          countSelectedBooks === 0 ? "delete-all" : "",
                        ]}
                      >
                        <DropdownItem
                          color="primary"
                          onClick={() => {
                            setModal("create");
                            onOpenChange();
                          }}
                          startContent={<Plus />}
                        >
                          Create new
                        </DropdownItem>
                        <DropdownItem
                          startContent={<RefreshCcw />}
                          key={"refresh"}
                          color="primary"
                          variant="flat"
                          onClick={() => {
                            fetchDataBook();
                          }}
                          showDivider
                        >
                          Refresh
                        </DropdownItem>
                        <DropdownItem
                          startContent={<Trash2 />}
                          key={"delete-all"}
                          color="danger"
                          variant="flat"
                          onClick={() => {
                            setModal("delete-all");
                            onOpenChange();
                          }}
                        >
                          Delete {countSelectedBooks} items
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              }
              bottomContent={
                filteredBooks.totalPage > 1 ? (
                  <div className="flex items-center justify-center">
                    <Pagination
                      total={filteredBooks.totalPage}
                      onChange={setPage}
                      radius="full"
                      aria-label="pagination"
                      aria-labelledby="pagination"
                    />
                  </div>
                ) : null
              }
            >
              <TableHeader>
                <TableColumn className="uppercase">title</TableColumn>
                <TableColumn className="uppercase">author</TableColumn>
                <TableColumn className="uppercase">publised</TableColumn>
                <TableColumn className="uppercase">sales</TableColumn>
                <TableColumn className="uppercase">price</TableColumn>
                <TableColumn className="uppercase">profit</TableColumn>
                <TableColumn className="uppercase">action</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={<EmptyTable />}
                loadingContent={<Spinner />}
                loadingState={loading ? "loading" : "idle"}
              >
                {filteredBooks.books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="capitalize">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      {new Date(book.publishedDate).toDateString()}
                    </TableCell>
                    <TableCell>{numberFormat(book.totalSales)}</TableCell>
                    <TableCell>
                      {numberFormat(book.price.amount)} {book.price.currency}
                    </TableCell>
                    <TableCell>
                      {numberFormat(book.totalSales * book.price.amount)}{" "}
                      {book.price.currency}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          color="warning"
                          variant="flat"
                          isIconOnly
                          size="sm"
                          onClick={() => {
                            setSelectedBook(book);
                            setModal("update");
                            onOpenChange();
                          }}
                        >
                          <Edit2 />
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          isIconOnly
                          size="sm"
                          onClick={() => {
                            setSelectedBook(book);
                            setModal("delete");
                            onOpenChange();
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
      {modal === "create" || modal === "update" ? (
        <ModalCreateUpdate
          type={modal}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title={modal === "create" ? "Create new" : "Update"}
          onSubmit={() => {
            fetchDataBook();
            onOpenChange();
          }}
          data={selectedBook}
        />
      ) : null}
      {modal === "delete" ? (
        <ModalDelete
          type={modal}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          title="Delete"
          data={selectedBook}
          onSubmit={() => {
            fetchDataBook();
            onOpenChange();
          }}
        />
      ) : null}
      {modal === "delete-all" ? (
        <ModalDeleteAll
          type="delete-all"
          title="Delete all"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSubmit={handleBulkDelete}
        />
      ) : null}
    </>
  );
};

const EmptyTable = () => {
  return (
    <>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Oops!</h1>
          <p className="text-lg">There is no data found in this table.</p>
        </div>
      </div>
    </>
  );
};

type ModalProps = {
  type: ModalType;
  title: string;
  isOpen: boolean;
  data?: Book;
  onOpenChange?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
};
const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    style: {
      backgroundColor: color.emerald[500],
      color: color.emerald[50],
      border: 0,
    },
  });
};
const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    style: {
      backgroundClip: color.red[500],
      color: color.red[50],
      border: 0,
    },
  });
};
const ModalCreateUpdate = (props: ModalProps) => {
  const { title, isOpen, data, type, onOpenChange, onSubmit } = props;
  const [book, setBook] = useState<Book>(data || ({} as Book));

  const handleCreate = async () => {
    const response = await fetch(`${api}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
    const data = await response.json();
    if (!data) {
      toastError("Failed to create book");
      return;
    }
    toastSuccess("Book created successfully");
    onSubmit && onSubmit();
    setBook({} as Book);
  };

  const handleUpdate = async () => {
    const response = await fetch(`${api}/books/${book.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
    const data = await response.json();
    if (!data) {
      toastError("Failed to update book");
      return;
    }
    toastSuccess("Book updated successfully");
    onSubmit && onSubmit();
  };

  const handleChange = (key: keyof Book, value: any) => {
    setBook({ ...book, [key]: value });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        aria-label="modal"
        aria-labelledby="modal"
      >
        <ModalContent aria-label="modal" aria-labelledby="modal">
          <ModalHeader>{title}</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Input
              label="Title"
              value={book.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <Input
              label="Author"
              value={book.author}
              onChange={(e) => handleChange("author", e.target.value)}
            />
            <Input
              label="Description"
              value={book.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            <Input
              label="Total Sales"
              type="number"
              value={book.totalSales ? book.totalSales.toString() : "0"}
              onChange={(e) =>
                handleChange("totalSales", Number(e.target.value))
              }
            />
            <Input
              label="Price"
              type="number"
              value={book?.price?.amount ? book.price.amount.toString() : "0"}
              onChange={(e) =>
                handleChange("price", {
                  ...book.price,
                  amount: Number(e.target.value),
                })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                type === "create" ? handleCreate() : handleUpdate()
              }
            >
              Submit
            </Button>
            <Button color="danger" variant="flat" onClick={onOpenChange}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Toaster />
    </>
  );
};

const ModalDelete = (props: ModalProps) => {
  const { isOpen, data, title, onOpenChange, onSubmit } = props;

  const handleDelete = async () => {
    const response = await fetch(`${api}/books/${data?.id}`, {
      method: "DELETE",
    });
    const res = await response.json();
    if (!res) {
      toastError("Failed to delete book");
      return;
    }
    toastSuccess("Book deleted successfully");
    onSubmit && onSubmit();
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent aria-label="modal" aria-labelledby="modal">
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <p>Are you sure want to delete this book?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDelete}>
              Yes
            </Button>
            <Button onClick={onOpenChange}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ModalDeleteAll = (props: ModalProps) => {
  const { isOpen, onOpenChange, onSubmit } = props;
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent aria-label="modal" aria-labelledby="modal">
          <ModalHeader>Delete All</ModalHeader>
          <ModalBody>
            <p>Are you sure want to delete all selected books?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={onSubmit}>
              Yes
            </Button>
            <Button onClick={onOpenChange}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
