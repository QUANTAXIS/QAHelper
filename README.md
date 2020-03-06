# qahelper README

A Fast Annotation Generate Tool, worked with [QAManual](https://github.com/QUANTAXIS/QAManual)


## Install 
just open vsode, and search `qahelper` in extension store. then click `install` and `reload` it.

It's easy to follow.

Before that, you should install `Python` Extensions and `Python Interpreter` first.

## Notice
annotation with self-define class is not supported
we just support datetime module and typing module

we recommand you to format your code after you finish your function 

## Usage

- right click -> QAFastGenerate
- ctrl + alt + i
- open command and type QAFastGenerate , then enter


## Support Platform 
- windows 
- linux 


## Example
```
def letsgo(name:str, age:int)->int:

    """
    explanation:
        Function meaning		

    params:
        * name ->:
            meaning:
            type: str
            optional: [Undeclared]
        * age ->:
            meaning:
            type: int
            optional: [Undeclared]

    return:
        int
	
    demonstrate:
        Not described
	
    output:
        Not described
    """
```

**Enjoy!**
