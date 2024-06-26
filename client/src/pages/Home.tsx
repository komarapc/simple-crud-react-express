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
const showPerPage = ["10", "20", "30", "50", "100"];
const api = "http://localhost:3000";
const fetchBooks = async () => {
  const response = await fetch(`${api}/books`);
  const data = await response.json();
  const { data: books } = data;
  return books || [];
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
  const [searchAuthor, setSearchAuthor] = useState("");
  const filteredBooks = useMemo(() => {
    const limit =
      Number(Array.from(perPage)[0]) ||
      Number(getKeyValue(perPage, "currentKey")) ||
      10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const query = searchTitle.toLowerCase();

    const booksFiltered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) &&
        book.author.toLowerCase().includes(searchAuthor.toLowerCase())
    );
    const booksSliced = booksFiltered.slice(start, end);
    const totalData = booksFiltered.length;
    const totalPage = Math.ceil(totalData / limit);
    return { books: booksSliced, totalPage, totalData };
  }, [books, searchTitle, perPage, page, searchAuthor]);

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
  }, 10000);

  const countSelectedBooks = useMemo(
    () => selectedBooks.length,
    [selectedBooks]
  );

  const handleBulkDelete = async () => {
    try {
      const response = await fetch(`${api}/books/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedBooks),
      });
      const data = await response.json();
      if (!data) {
        toastError({ message: "Error", description: "Oops something wrong!" });

        return;
      }
      toastSuccess("Books deleted successfully");
      setSelectedKeys(new Set([]));
      setSelectedBooks([]);
      fetchDataBook();
      onOpenChange();
    } catch (error) {
      toastError({ message: "Error", description: "Oops something wrong!" });

      onOpenChange();
    }
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
    <div className="dark bg-zinc-950 w-full min-h-screen">
      <div className="container mx-auto py-10 font-inter">
        <Card className={cn("dark ")}>
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
                      classNames={{
                        popoverContent: cn("dark bg-zinc-900 text-foreground"),
                      }}
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
                    <Input
                      label="Search author"
                      onChange={(e) => setSearchAuthor(e.target.value)}
                      value={searchAuthor}
                      className="w-full lg:w-64"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      variant="dot"
                      color={serverOnline ? "success" : "danger"}
                      size="lg"
                      classNames={{
                        dot: "w-3 h-3 animate-pulse",
                      }}
                    >
                      {serverOnline ? "Server Online" : "Server Offline"}
                    </Chip>
                    <Chip
                      variant="dot"
                      color={countSelectedBooks ? "primary" : "danger"}
                      classNames={{
                        dot: cn(
                          !countSelectedBooks && "animate-pulse",
                          "w-3 h-3"
                        ),
                      }}
                    >
                      {countSelectedBooks} items selected
                    </Chip>
                    <Dropdown className="dark text-zinc-50">
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
                          countSelectedBooks === 0 || !serverOnline
                            ? "delete-all"
                            : "",
                        ]}
                      >
                        <DropdownItem
                          color="primary"
                          onClick={() => {
                            setModal("create");
                            onOpenChange();
                          }}
                          startContent={<Plus />}
                          textValue="Create new"
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
                          textValue="Refresh"
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
                          textValue="Delete all"
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
                          isDisabled={!serverOnline}
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
                          isDisabled={!serverOnline}
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
          onOpenChange={() => {
            onOpenChange();
            setSelectedBook({} as Book);
          }}
          title={modal === "create" ? "Create new" : "Update"}
          onSubmit={() => {
            fetchDataBook();
            onOpenChange();
          }}
          data={modal === "update" ? selectedBook : ({} as Book)}
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
    </div>
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
    position: "bottom-center",
    style: {
      backgroundColor: color.zinc[900],
      color: color.emerald[500],
      border: 0,
    },
  });
};
const toastError = ({
  message,
  description,
}: {
  message: string;
  description?: string;
}) => {
  toast.error(message, {
    description,
    position: "bottom-center",
    style: {
      backgroundColor: color.zinc[900],
      color: color.red[500],
      border: 0,
    },
  });
};
const ModalCreateUpdate = (props: ModalProps) => {
  const { title, isOpen, data, type, onOpenChange, onSubmit } = props;
  const [book, setBook] = useState<Book>(data || ({} as Book));

  const handleCreate = async () => {
    try {
      const response = await fetch(`${api}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      const data = await response.json();
      if (!data) {
        toastError({ message: "Error", description: "Oops something wrong!" });
        return;
      }
      toastSuccess("Book created successfully");
      onSubmit && onSubmit();
      setBook({} as Book);
    } catch (error) {
      toastError({ message: "Error", description: "Oops something wrong!" });

      return;
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${api}/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      const data = await response.json();
      if (!data) {
        toastError({ message: "Error", description: "Oops something wrong!" });

        return;
      }
      toastSuccess("Book updated successfully");
      onSubmit && onSubmit();
    } catch (error) {
      toastError({ message: "Error", description: "Oops something wrong!" });

      return;
    }
  };

  const handleChange = (key: keyof Book, value: any) => {
    setBook({ ...book, [key]: value });
  };

  useEffect(() => {
    if (data) setBook(data || ({} as Book));
  }, [data]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        aria-label="modal"
        aria-labelledby="modal"
      >
        <ModalContent
          aria-label="modal"
          aria-labelledby="modal"
          className="dark text-foreground"
        >
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
      toastError({
        message: "Error",
        description: "We could not fetch the data",
      });
      return;
    }
    toastSuccess("Book deleted successfully");
    onSubmit && onSubmit();
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent
          aria-label="modal"
          aria-labelledby="modal"
          className="dark text-foreground"
        >
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
        <ModalContent
          aria-label="modal"
          aria-labelledby="modal"
          className="dark text-foreground"
        >
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
