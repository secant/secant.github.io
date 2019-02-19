---
layout: guide
title: CS 61B Spring 2017 Midterm 1 Guide
---
(select problems.)

* toc
{:toc}

## 4. Flirbocon, part (b).
This question becomes more clear with a review of rules that Java uses for
figuring out which method to invoke during compile-time (i.e., statically) and
during run-time (i.e., dynamically).

### Choosing Methods: When & How
When you feed your program to `javac`, it will analyze your program according to
the **static type**. This is why you can cast your object into something that
satisfies `javac`, but your compiled code (run with `java`) still crashes.

There are two types of methods that have the same method name: *overloaded*
methods and *overrided* methods. Let's review the implications of each.

#### Overloaded Methods
Overloaded methods are methods in a class that have the same function name, but
different arguments. For example, `add(int x, int y)` and `add(double x, double
y)` are overloaded methods.

It's easier to reason about these methods if you
treat them as methods with _different_ names. For example, treat the above two
methods as if their signatures were `add_int(int x, int y)` and
`add_doubles(double x, double y)`, respectively. (It is functionally the same).

When you call an overloaded method and run `javac`, the compiler picks the
method that *most closely matches* the *static* types of the arguments you pass
in.
- If we wrote `add(4, 6)`, it would be like writing `add_int(4, 6)`.
- If we wrote `add((double) 4, (double) 6)`, it would be like writing
  `add_double((double) 4, (double) 6)`.

#### Overrided Methods
Overrided methods are methods defined in a parent class that a child class also
defines, hence the child class is overriding the parent's method. For example:

```java
public class Dog {
    public Dog() {}
    public void bark() {
        System.out.println("Dog Woof.");
    }
}

public class Poodle extends Dog {
    public Poodle() {}
    @Override
    public void bark() {
        System.out.println("Poodle Woof.");
    }
}
```

Here, the `Poodle` class is the child class of `Dog` and it overrides the `bark`
method.

When you call overrided method, the compiler will choose the method signature
that needs to be found based on the static types of the arguments. This narrows
down the possible methods to methods in the object's class / ancestor classes /
descendant classes. Then, based on the *dynamic type*, i.e., the type at runtime
of the object, a method will be selected by the following procedure:
- IF the dynamic type (let's call this `t`) does not have the method,
    - UNTIL the method is found:
        - Set `t` to be the parent class of `t`
        - Look for the method in the class `t`

Think of the procedure as a bottom-up tree traversal starting at the dynamic
type, where each node in the tree is a class that points down to its child
class(es), e.g.,
```
 [ Dog ]
    |
    |
    V
[ Poodle ]
```

Consider these extended `Dog` & `Poodle` classes, where `bark` is _both_
overrided and overloaded:
```java
public class Dog {
    public Dog() {}
    public void bark() {
        System.out.println("Dog Woof.");
    }
    public void bark(Dog d) {
        System.out.println("Dog Woof Dog.");
    }
    public void bark(Poodle d) {
        System.out.println("Dog Woof Poodle.");
    }
}

public class Poodle extends Dog {
    public Poodle() {}
    @Override
    public void bark() {
        System.out.println("Poodle Woof.");
    }
    @Override
    public void bark(Dog d) {
        System.out.println("Poodle Woof Dog.");
    }
    @Override
    public void bark(Poodle d) {
        System.out.println("Poodle Woof Poodle.");
    }
}
```

First, let's illustrate how the static types will affect method invocation.
Again, treat overloaded methods as if the methods had different names, e.g.
`bark1`, `barkdog`, `barkpoodle`.

```java
public static void main(String []args) {
    Dog d = new Dog();
    Poodle p = new Poodle();
    d.bark((Dog) p);    // Argument has static type Dog.
    d.bark(p);          // Argument has static type Poodle.
}
```

The output of the above program is:
```
Dog Woof Dog.       // It's like we called Dog::barkdog.
Dog Woof Poodle.    // It's like we called Dog::barkpoodle.
```

Now, let's throw overriding into the mix. Remember, the method signature has
already been determined by the compiler, we just need to find the specific
class method to call, which is dependent on the object's dynamic type.

```java
public static void main(String []args) {
    Dog d = new Poodle();       // Static type Dog, dynamic type Poodle.
    Poodle p = new Poodle();    // Static type Poodle, dynamic type Poodle.
    d.bark((Dog) p);            // Argument has static type Dog.
    d.bark(p);                  // Argument has static type Poodle.
}
```

The output of the above program is:
```
Poodle Woof Dog.       // It's like we called Poodle::barkdog.
Poodle Woof Poodle.    // It's like we called Poodle::barkpoodle.
```

A side-note: this example is very contrived. It's pretty strange to define a
method in a parent class that mentions a child class.

Ok, on to the question...

- F1. The `Bird::gulgate(Bird)` method exists.
- F2. The `Bird::gulgate(Falcon)` method exists.
- F3. The `Falcon::gulgate(Bird)` method exists.
- F4. The `Falcon::gulgate(Falcon)` method exists.

Suppose we make a call to `falcon.gulgate(falcon)`:

### b(i)
Which features are sufficient ALONE for this call to compile?

Answer: F1, F2, F3, F4.

This question asks which features ALONE will allow `falcon.gulgate(falcon)` to
compile. That means:
- if we only have F1, it will compile
- if we only have F2, it will compile
- if we only have F3, it will compile
- if we only have F4, it will compile

Using what you learned above, try to convince yourself that each statement is
true. Note that the static and dynamic type of falcon is `Falcon`.

### b(ii)
Select a set of features such that this call executes the `Bird::gulgate(Bird)` method.

Answer: F1.

- if F2 was selected, F2 would be executed (a `Falcon` is more specific than
    `Bird`, and falcon is of static type `Falcon`).
- if F3 was selected, F3 would be executed (`falcon` is of dynamic type `Falcon`).
- if F4 was selected, F4 would be executed (`falcon` is of static type `Falcon`,
    and F4 takes a `Falcon` as an argument, which is more specific than `Bird`.).

### b(iii)
Select a set of features such that this call executes the `Bird::gulgate(Falcon)` method.

Answer: F2, and NOT F4 (you would have received full credit if you put F1, F2,
F3).

- if F4 was selected, F4 would be executed. Why? Hint: what is the dynamic type
    of `falcon`?

### b(iv)
Select a set of features such that this call executes the `Falcon::gulgate(Bird)` method.
Answer: F3 and NOT F4 or F2. (you would have received full credit if you put F1,
F3).
- if F2 was selected, F2 would be executed. Why? Hint: How does the static type
    affect method selection?
- if F4 was selected, F4 would be executed. Why? Hint: How does the static type
    affect method selection?

### b(v)
Select a set of features such that this call executes the `Falcon::gulgate(Falcon)` method.
Answer: F4, but F1/F2/F3 can be checked -- it doesn't matter. Why?
